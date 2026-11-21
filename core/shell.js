import { story } from "../stories/anna/story.js";
import { createPost } from "./components/post.js";

const storyBase = "stories/anna/";
const storageKey = `lovelettuh:story:${story.id}:state`;

// Storage can be disabled (private mode) or hold old/broken data, so always
// fall back to a clean state for this story.
function loadState() {
  const empty = { likedPosts: [], userComments: {} };
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return empty;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return empty;

    const likedPosts = Array.isArray(saved.likedPosts)
      ? [...new Set(saved.likedPosts.filter((id) => typeof id === "string"))]
      : [];

    const userComments = {};
    if (saved.userComments && typeof saved.userComments === "object") {
      for (const [postId, list] of Object.entries(saved.userComments)) {
        if (Array.isArray(list)) {
          userComments[postId] = list.filter(
            (comment) =>
              comment &&
              typeof comment.id === "string" &&
              typeof comment.authorId === "string" &&
              typeof comment.text === "string"
          );
        }
      }
    }

    return { likedPosts, userComments };
  } catch (error) {
    // Ignore unavailable or invalid storage.
    return empty;
  }
}

function saveState() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        likedPosts: state.likedPosts,
        userComments: state.userComments,
      })
    );
  } catch (error) {
    // Ignore unavailable storage: likes and comments work for this visit.
  }
}

const state = {
  tab: "feed",
  storyId: story.id,
  ...loadState(),
};

const titles = {
  feed: "Feed",
  messages: "Messages",
  profile: "Profile",
};

const titleEl = document.querySelector("#screen-title");
const tabButtons = document.querySelectorAll("[data-tab]");
const screens = document.querySelectorAll("[data-screen]");

function showTab(tabId) {
  state.tab = tabId;
  titleEl.textContent = titles[tabId];

  screens.forEach((screen) => {
    screen.hidden = screen.dataset.screen !== tabId;
  });

  tabButtons.forEach((button) => {
    if (button.dataset.tab === tabId) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showTab(button.dataset.tab);
  });
});

const feed = document.querySelector('[data-screen="feed"]');
feed.replaceChildren();

for (const post of story.posts) {
  feed.append(
    createPost(post, {
      users: story.users,
      assetBase: storyBase,
      currentUserId: story.currentUserId,
      liked: state.likedPosts.includes(post.id),
      onLikeChange(postId, liked) {
        if (liked) {
          if (!state.likedPosts.includes(postId)) state.likedPosts.push(postId);
        } else {
          state.likedPosts = state.likedPosts.filter((id) => id !== postId);
        }
        saveState();
      },
      playerComments: state.userComments[post.id] || [],
      onAddComment(postId, text) {
        const comment = {
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          authorId: story.currentUserId,
          text,
        };
        if (!state.userComments[postId]) state.userComments[postId] = [];
        state.userComments[postId].push(comment);
        saveState();
        return comment;
      },
    })
  );
}

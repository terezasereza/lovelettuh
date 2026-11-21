import { story } from "../stories/anna/story.js";
import { createPost } from "./components/post.js";

const storyBase = "stories/anna/";
const storageKey = `lovelettuh:story:${story.id}:state`;

// Storage can be disabled (private mode) or hold old/broken data, so always
// fall back to a clean state for this story.
function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && Array.isArray(saved.likedPosts)) {
        return {
          likedPosts: [...new Set(saved.likedPosts.filter((id) => typeof id === "string"))],
        };
      }
    }
  } catch (error) {
    // Ignore unavailable or invalid storage.
  }
  return { likedPosts: [] };
}

function saveState() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ likedPosts: state.likedPosts })
    );
  } catch (error) {
    // Ignore unavailable storage: likes still work for this visit.
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
    })
  );
}

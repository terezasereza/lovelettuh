import { story } from "../stories/anna/story.js";
import { createPost } from "./components/post.js";

const storyBase = "stories/anna/";

const state = {
  tab: "feed",
  storyId: story.id,
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
    })
  );
}

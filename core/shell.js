import { story } from "../stories/anna/story.js";
import { createPost } from "./components/post.js";
import { createChatList } from "./screens/messages.js";
import { createChatView } from "./screens/chat.js";
import { createProfileView } from "./screens/profile.js";
import { initOnlineDots, setOnline } from "./components/online-dot.js";

const storyBase = "stories/anna/";
const storageKey = `lovelettuh:story:${story.id}:state`;

function cleanMessages(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((message) => message && typeof message.id === "string" && typeof message.text === "string")
    .map((message) => ({
      id: message.id,
      senderId: typeof message.senderId === "string" ? message.senderId : story.currentUserId,
      text: message.text,
      time: typeof message.time === "string" ? message.time : "",
    }));
}

// Storage can be disabled (private mode) or hold old/broken data, so always
// fall back to a clean state for this story. Old saves without the message
// fields simply get empty defaults.
function loadState() {
  const empty = {
    likedPosts: [],
    userComments: {},
    sentMessages: {},
    onlineOverrides: {},
    draftOpen: {},
  };
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

    const sentMessages = {};
    if (saved.sentMessages && typeof saved.sentMessages === "object") {
      for (const [conversationId, list] of Object.entries(saved.sentMessages)) {
        const messages = cleanMessages(list);
        if (messages.length) sentMessages[conversationId] = messages;
      }
    }

    const onlineOverrides = {};
    if (saved.onlineOverrides && typeof saved.onlineOverrides === "object") {
      for (const [userId, online] of Object.entries(saved.onlineOverrides)) {
        if (typeof online === "boolean") onlineOverrides[userId] = online;
      }
    }

    const draftOpen = {};
    if (saved.draftOpen && typeof saved.draftOpen === "object") {
      for (const [conversationId, open] of Object.entries(saved.draftOpen)) {
        if (typeof open === "boolean") draftOpen[conversationId] = open;
      }
    }

    return { likedPosts, userComments, sentMessages, onlineOverrides, draftOpen };
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
        sentMessages: state.sentMessages,
        onlineOverrides: state.onlineOverrides,
        draftOpen: state.draftOpen,
      })
    );
  } catch (error) {
    // Ignore unavailable storage: changes work for this visit.
  }
}

const state = {
  tab: "feed",
  storyId: story.id,
  ...loadState(),
};

initOnlineDots({
  users: story.users,
  overrides: state.onlineOverrides,
  onChange: saveState,
});
// Story code can use this later; useful for testing from the console.
window.setOnline = setOnline;

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

// Feed and profile share the same post component and the same state, so a like
// or comment made in one place shows up in the other.
function changeLike(postId, liked) {
  if (liked) {
    if (!state.likedPosts.includes(postId)) state.likedPosts.push(postId);
  } else {
    state.likedPosts = state.likedPosts.filter((id) => id !== postId);
  }
  saveState();
  syncPosts();
}

function addComment(postId, text) {
  const comment = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    authorId: story.currentUserId,
    text,
  };
  if (!state.userComments[postId]) state.userComments[postId] = [];
  state.userComments[postId].push(comment);
  saveState();
  syncPosts();
  return comment;
}

// Feed and profile can both show the same post. Re-read state so every copy
// updates immediately after a like or comment.
function syncPosts() {
  document.querySelectorAll(".post").forEach((article) => {
    if (typeof article.refreshPost === "function") article.refreshPost();
  });
}

function postOptions(post) {
  return {
    users: story.users,
    assetBase: storyBase,
    currentUserId: story.currentUserId,
    liked: state.likedPosts.includes(post.id),
    onLikeChange: changeLike,
    playerComments: state.userComments[post.id] || [],
    onAddComment: addComment,
    getLiked: () => state.likedPosts.includes(post.id),
    getComments: () => state.userComments[post.id] || [],
  };
}

const feed = document.querySelector('[data-screen="feed"]');
feed.replaceChildren();
for (const post of story.posts) feed.append(createPost(post, postOptions(post)));

const profileScreen = document.querySelector('[data-screen="profile"]');
const ownProfile = createProfileView({
  userId: story.currentUserId,
  users: story.users,
  posts: story.posts,
  assetBase: storyBase,
  currentUserId: story.currentUserId,
  state,
  onLikeChange: changeLike,
  onAddComment: addComment,
});
profileScreen.replaceChildren(ownProfile.element);

const app = document.querySelector(".app");
const messagesScreen = document.querySelector('[data-screen="messages"]');
let activeChat = null;

function allMessages(conversation) {
  return [...(conversation.messages || []), ...(state.sentMessages[conversation.id] || [])];
}

function displayTime() {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch (error) {
    return "Now";
  }
}

const chatList = createChatList({
  conversations: story.conversations || [],
  users: story.users,
  assetBase: storyBase,
  currentUserId: story.currentUserId,
  state,
  onOpen: (conversationId) => openConversation(conversationId),
});
messagesScreen.replaceChildren(chatList.element);

function closeConversation({ updateHistory = true } = {}) {
  if (!activeChat) return;
  activeChat.view.element.classList.remove("is-active");
  activeChat.view.element.remove();
  activeChat = null;
  app.classList.remove("is-chat-open");
  chatList.element.hidden = false;
  if (updateHistory && history.state && history.state.chatId) history.back();
}

function openConversation(conversationId, { pushHistory = true } = {}) {
  const conversation = (story.conversations || []).find((item) => item.id === conversationId);
  if (!conversation) return;
  if (activeChat && activeChat.id === conversationId) return;
  if (activeChat) closeConversation({ updateHistory: false });

  const user = story.users[conversation.withUserId] || { name: "Unknown" };
  const view = createChatView({
    conversation,
    user,
    assetBase: storyBase,
    currentUserId: story.currentUserId,
    messages: allMessages(conversation),
    draft: conversation.draft,
    draftOpen: Boolean(state.draftOpen[conversation.id]),
    onBack: closeConversation,
    onDraftToggle(open) {
      state.draftOpen[conversation.id] = open;
      saveState();
    },
    onSend(text) {
      const message = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        senderId: story.currentUserId,
        text,
        time: displayTime(),
      };
      if (!state.sentMessages[conversation.id]) state.sentMessages[conversation.id] = [];
      state.sentMessages[conversation.id].push(message);
      saveState();
      chatList.render();
      return message;
    },
  });

  activeChat = { id: conversationId, view };
  chatList.element.hidden = true;
  messagesScreen.append(view.element);
  view.element.classList.add("is-active");
  app.classList.add("is-chat-open");
  if (pushHistory) history.pushState({ chatId: conversationId }, "");

  requestAnimationFrame(() => {
    view.scrollToBottom();
    view.refreshDraft();
  });
}

window.addEventListener("popstate", (event) => {
  const chatId = event.state && event.state.chatId;
  if (chatId) {
    openConversation(chatId, { pushHistory: false });
  } else {
    closeConversation({ updateHistory: false });
  }
});

// A reload while a chat was open should land back in that chat.
const initialChatId = history.state && history.state.chatId;
if (initialChatId) openConversation(initialChatId, { pushHistory: false });

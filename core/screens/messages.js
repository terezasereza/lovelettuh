// The chat list: one row per authored conversation, with the last message
// (including ones the player sent) shown as a preview.

import { createAvatar } from "../components/avatar.js";
import { createOnlineDot } from "../components/online-dot.js";

export function createChatList({ conversations, users, assetBase, currentUserId, state, onOpen }) {
  const list = document.createElement("div");
  list.className = "chat-list";

  function lastMessage(conversation) {
    const sent = state.sentMessages[conversation.id] || [];
    if (sent.length) return sent[sent.length - 1];
    const authored = conversation.messages || [];
    return authored.length ? authored[authored.length - 1] : null;
  }

  function preview(conversation) {
    const message = lastMessage(conversation);
    if (!message) return "No messages yet";
    const text = message.text || "";
    return message.senderId === currentUserId ? `You: ${text}` : text;
  }

  function render() {
    list.replaceChildren();
    for (const conversation of conversations) {
      const user = users[conversation.withUserId] || { name: "Unknown" };
      const last = lastMessage(conversation);

      const row = document.createElement("button");
      row.type = "button";
      row.className = "chat-row";
      row.dataset.conversationId = conversation.id;

      const avatar = createAvatar(user, assetBase);
      avatar.classList.add("chat-row-avatar");

      const info = document.createElement("span");
      info.className = "chat-row-info";

      const top = document.createElement("span");
      top.className = "chat-row-top";
      const name = document.createElement("span");
      name.className = "chat-row-name";
      name.textContent = user.name;
      const time = document.createElement("span");
      time.className = "chat-row-time";
      time.textContent = last && last.time ? last.time : "";
      top.append(name, time);

      const previewEl = document.createElement("span");
      previewEl.className = "chat-row-preview";
      previewEl.textContent = preview(conversation);

      info.append(top, previewEl);
      row.append(avatar, info, createOnlineDot(conversation.withUserId));
      row.addEventListener("click", () => onOpen(conversation.id));
      list.append(row);
    }
  }

  render();
  return { element: list, render };
}

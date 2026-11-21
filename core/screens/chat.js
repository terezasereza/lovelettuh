// One conversation: header, message history and the compose area at the bottom.
// Everything comes from story data + state; this file has no story-specific
// knowledge.

import { createAvatar } from "../components/avatar.js";
import { createOnlineDot } from "../components/online-dot.js";
import { createDraftPanel } from "../components/draft-panel.js";

export function createChatView({
  conversation,
  user,
  assetBase,
  currentUserId,
  messages,
  draft,
  draftOpen,
  onBack,
  onSend,
  onDraftToggle,
}) {
  const view = document.createElement("div");
  view.className = "chat-view";

  const header = document.createElement("header");
  header.className = "chat-header";

  const back = document.createElement("button");
  back.type = "button";
  back.className = "chat-back";
  back.setAttribute("aria-label", "Back to messages");
  back.textContent = "‹";
  back.addEventListener("click", onBack);

  const avatar = createAvatar(user, assetBase);
  avatar.classList.add("chat-header-avatar");

  const name = document.createElement("p");
  name.className = "chat-header-name";
  name.textContent = (user && user.name) || "Unknown";

  header.append(back, avatar, name, createOnlineDot(conversation.withUserId));

  const history = document.createElement("ol");
  history.className = "chat-messages";

  function createMessageElement(message) {
    const item = document.createElement("li");

    // A date entry has no sender or text: it draws a divider between days.
    if (typeof message.date === "string") {
      item.className = "chat-date";
      item.textContent = message.date;
      return item;
    }

    item.className = "chat-message";
    item.classList.add(
      message.senderId === currentUserId ? "chat-message--mine" : "chat-message--theirs"
    );

    const bubble = document.createElement("p");
    bubble.className = "chat-bubble";
    bubble.textContent = message.text || "";

    const time = document.createElement("span");
    time.className = "chat-time";
    time.textContent = message.time || "";

    item.append(bubble, time);
    return item;
  }

  function scrollToBottom() {
    history.scrollTop = history.scrollHeight;
  }

  for (const message of messages) history.append(createMessageElement(message));

  const compose = document.createElement("div");
  compose.className = "chat-compose";

  let draftPanel = null;
  if (draft) {
    draftPanel = createDraftPanel(draft, { open: draftOpen, onToggle: onDraftToggle });
  }

  const form = document.createElement("form");
  form.className = "chat-form";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "chat-input";
  input.placeholder = "Message";
  input.setAttribute("aria-label", "Message");
  input.autocomplete = "off";

  const send = document.createElement("button");
  send.type = "submit";
  send.className = "chat-send";
  send.textContent = "Send";

  form.append(input, send);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    input.value = "";
    if (!text) return;

    const message = onSend(text);
    if (message) {
      history.append(createMessageElement(message));
      scrollToBottom();
    }
  });

  if (draftPanel) compose.append(draftPanel.element);
  compose.append(form);
  view.append(header, history, compose);

  return {
    element: view,
    scrollToBottom,
    refreshDraft: () => draftPanel && draftPanel.refresh(),
  };
}

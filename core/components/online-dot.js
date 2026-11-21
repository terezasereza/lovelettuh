// One central place for the little green "online" dot. The starting value
// comes from story data and can be overridden with setOnline().

let context = { users: {}, overrides: {}, onChange: () => {} };

export function initOnlineDots({ users, overrides, onChange = () => {} }) {
  context = { users, overrides, onChange };
}

export function isOnline(userId) {
  const { users, overrides } = context;
  if (Object.prototype.hasOwnProperty.call(overrides, userId)) {
    return Boolean(overrides[userId]);
  }
  return Boolean(users[userId] && users[userId].online);
}

function refreshDot(dot) {
  dot.classList.toggle("is-online", isOnline(dot.dataset.onlineUser));
}

export function createOnlineDot(userId) {
  const dot = document.createElement("span");
  dot.className = "online-dot";
  dot.dataset.onlineUser = userId;
  dot.setAttribute("aria-hidden", "true");
  refreshDot(dot);
  return dot;
}

// Story code (or the browser console) can call setOnline("leo", false).
export function setOnline(userId, online) {
  context.overrides[userId] = Boolean(online);
  document.querySelectorAll(".online-dot").forEach((dot) => {
    if (dot.dataset.onlineUser === userId) refreshDot(dot);
  });
  context.onChange();
}

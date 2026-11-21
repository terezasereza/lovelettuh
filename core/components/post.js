// Turns one post (plus the story's user list) into a DOM element.
// Knows nothing about a particular story. assetBase is the story folder
// URL, because image paths in the data are relative to that folder.

function urlFor(assetBase, path) {
  if (!path) return "";
  if (/^(?:[a-z]+:|\/)/i.test(path)) return path;
  return assetBase + path;
}

// The data never changes: the count is always the authored number (or list)
// plus one if the player has liked this post. Recomputing it on every toggle
// means quick double taps cannot drift the count.
function likeCount(likes, liked, currentUserId) {
  let count;
  if (Array.isArray(likes)) {
    count = likes.length;
    if (liked && !likes.includes(currentUserId)) count += 1;
  } else {
    const number = Number(likes);
    count = Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
    if (liked) count += 1;
  }
  return count;
}

function userById(users, id) {
  return users[id] || { name: "Unknown" };
}

function escapeXml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[char]);
}

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return (
    parts
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function dataImage(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function avatarFallback(name) {
  return dataImage(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#d9d9d9"/><text x="40" y="52" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="600" fill="#666">${escapeXml(initials(name))}</text></svg>`
  );
}

function imageFallback() {
  return dataImage(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#eee"/><circle cx="265" cy="320" r="60" fill="#ccc"/><path d="M110 810 330 555 475 715 600 610 730 810Z" fill="#ccc"/></svg>`
  );
}

// Missing or broken files show a drawn placeholder instead of a broken icon.
function setImage(img, url, fallback) {
  if (!url) {
    img.src = fallback;
    return;
  }
  img.addEventListener("error", () => { img.src = fallback; }, { once: true });
  img.src = url;
}

export function createPost(
  post,
  {
    users,
    assetBase,
    currentUserId,
    liked = false,
    onLikeChange = () => {},
    playerComments = [],
    onAddComment = () => {},
  }
) {
  const author = userById(users, post.authorId);

  const article = document.createElement("article");
  article.className = "post";
  article.dataset.postId = post.id;

  const header = document.createElement("header");
  header.className = "post-header";

  const avatar = document.createElement("img");
  avatar.className = "post-avatar";
  avatar.alt = "";
  setImage(avatar, urlFor(assetBase, author.avatar), avatarFallback(author.name));

  const name = document.createElement("p");
  name.className = "post-author";
  name.textContent = author.name;

  header.append(avatar, name);

  const caption = document.createElement("p");
  caption.className = "post-caption";
  caption.textContent = post.caption || "";

  const image = document.createElement("img");
  image.className = "post-image";
  image.alt = "";
  setImage(image, urlFor(assetBase, post.image), imageFallback());

  const actions = document.createElement("div");
  actions.className = "post-actions";

  const like = document.createElement("button");
  like.type = "button";
  like.className = "post-like";

  const icon = document.createElement("span");
  icon.className = "post-like-icon";
  icon.setAttribute("aria-hidden", "true");

  const countEl = document.createElement("span");
  countEl.className = "post-like-count";

  function renderLike() {
    const count = likeCount(post.likes, liked, currentUserId);
    icon.textContent = liked ? "♥" : "♡";
    countEl.textContent = String(count);
    like.setAttribute("aria-pressed", String(liked));
    like.setAttribute("aria-label", count === 1 ? "1 like" : `${count} likes`);
  }

  like.addEventListener("click", () => {
    liked = !liked;
    renderLike();
    onLikeChange(post.id, liked);
  });

  renderLike();
  like.append(icon, countEl);
  actions.append(like);

  const comments = document.createElement("ul");
  comments.className = "post-comments";
  for (const comment of [...(post.comments || []), ...playerComments]) {
    comments.append(createComment(comment, users, assetBase));
  }

  const form = document.createElement("form");
  form.className = "post-comment-form";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "post-comment-input";
  input.placeholder = "Add a comment…";
  input.setAttribute("aria-label", "Add a comment");

  const send = document.createElement("button");
  send.type = "submit";
  send.className = "post-comment-send";
  send.textContent = "Post";

  form.append(input, send);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    input.value = "";
    if (!text) return; // Empty comments are ignored.

    const comment = onAddComment(post.id, text);
    if (comment) comments.append(createComment(comment, users, assetBase));
  });

  article.append(header, caption, image, actions, comments, form);
  return article;
}

function createComment(comment, users, assetBase) {
  const user = userById(users, comment.authorId);

  const item = document.createElement("li");
  item.className = "post-comment";

  const avatar = document.createElement("img");
  avatar.className = "post-avatar post-avatar--small";
  avatar.alt = "";
  setImage(avatar, urlFor(assetBase, user.avatar), avatarFallback(user.name));

  const text = document.createElement("p");
  const author = document.createElement("span");
  author.className = "post-comment-author";
  author.textContent = user.name;
  text.append(author, document.createTextNode(` ${comment.text || ""}`));

  item.append(avatar, text);
  return item;
}

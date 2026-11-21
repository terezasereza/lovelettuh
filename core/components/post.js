// Turns one post (plus the story's user list) into a DOM element.
// Knows nothing about a particular story. assetBase is the story folder
// URL, because image paths in the data are relative to that folder.

function urlFor(assetBase, path) {
  if (!path) return "";
  if (/^(?:[a-z]+:|\/)/i.test(path)) return path;
  return assetBase + path;
}

function likeCount(likes) {
  if (Array.isArray(likes)) return likes.length;
  const number = Number(likes);
  if (Number.isFinite(number)) return Math.max(0, Math.floor(number));
  return 0;
}

function userById(users, id) {
  return users[id] || { name: "Unknown" };
}

export function createPost(post, { users, assetBase }) {
  const author = userById(users, post.authorId);

  const article = document.createElement("article");
  article.className = "post";
  article.dataset.postId = post.id;

  const header = document.createElement("header");
  header.className = "post-header";

  const avatar = document.createElement("img");
  avatar.className = "post-avatar";
  avatar.alt = "";
  avatar.src = urlFor(assetBase, author.avatar);

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
  image.src = urlFor(assetBase, post.image);

  const count = likeCount(post.likes);
  const actions = document.createElement("div");
  actions.className = "post-actions";

  const like = document.createElement("p");
  like.className = "post-like";
  like.setAttribute(
    "aria-label",
    count === 1 ? "1 like" : `${count} likes`
  );

  const icon = document.createElement("span");
  icon.className = "post-like-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "♡";

  const countEl = document.createElement("span");
  countEl.className = "post-like-count";
  countEl.textContent = String(count);

  like.append(icon, countEl);
  actions.append(like);

  const comments = document.createElement("ul");
  comments.className = "post-comments";
  for (const comment of post.comments || []) {
    comments.append(createComment(comment, users, assetBase));
  }

  article.append(header, caption, image, actions, comments);
  return article;
}

function createComment(comment, users, assetBase) {
  const user = userById(users, comment.authorId);

  const item = document.createElement("li");
  item.className = "post-comment";

  const avatar = document.createElement("img");
  avatar.className = "post-avatar post-avatar--small";
  avatar.alt = "";
  avatar.src = urlFor(assetBase, user.avatar);

  const text = document.createElement("p");
  const author = document.createElement("span");
  author.className = "post-comment-author";
  author.textContent = user.name;
  text.append(author, document.createTextNode(` ${comment.text || ""}`));

  item.append(avatar, text);
  return item;
}

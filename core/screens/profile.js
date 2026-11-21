// One reusable profile screen: pass a userId and it renders that person.
// It knows nothing about a particular story; all content comes from the
// users/posts data and the central state passed in by the shell.

import { createAvatar } from "../components/avatar.js";
import { createOnlineDot } from "../components/online-dot.js";

function urlFor(assetBase, path) {
  if (!path) return "";
  if (/^(?:[a-z]+:|\/)/i.test(path)) return path;
  return assetBase + path;
}

export function createProfileView({
  userId,
  users,
  posts = [],
  assetBase = "",
  currentUserId,
  state = {},
  onLikeChange = () => {},
  onAddComment = () => {},
  onOpenFriend = () => {},
  onBack = null,
}) {
  const user = users[userId] || { name: "Unknown" };

  const view = document.createElement("div");
  view.className = "profile-view";
  view.dataset.profileUser = userId;

  const scroll = document.createElement("div");
  scroll.className = "profile-scroll";

  // The banner is a gradient; the image sits on top when it exists and loads.
  // A missing or broken cover simply leaves the gradient visible.
  const cover = document.createElement("div");
  cover.className = "profile-cover";
  if (user.cover) {
    const coverImage = document.createElement("img");
    coverImage.className = "profile-cover-image";
    coverImage.alt = "";
    coverImage.addEventListener("error", () => coverImage.remove(), { once: true });
    coverImage.src = urlFor(assetBase, user.cover);
    cover.append(coverImage);
  }

  const header = document.createElement("div");
  header.className = "profile-header";

  const avatar = createAvatar(user, assetBase);
  avatar.classList.add("profile-avatar");

  const identity = document.createElement("div");
  identity.className = "profile-identity";

  const nameRow = document.createElement("div");
  nameRow.className = "profile-name-row";

  const name = document.createElement("h2");
  name.className = "profile-name";
  name.textContent = user.name || "Unknown";

  nameRow.append(name, createOnlineDot(userId));
  identity.append(nameRow);

  if (user.bio) {
    const bio = document.createElement("p");
    bio.className = "profile-bio";
    bio.textContent = user.bio;
    identity.append(bio);
  }

  header.append(avatar, identity);
  scroll.append(cover, header);

  const aboutLabels = {
    livesIn: "Lives in",
    from: "From",
    works: "Works",
    studied: "Studied",
    relationship: "Relationship",
  };

  function aboutLabel(field) {
    if (aboutLabels[field]) return aboutLabels[field];
    // Unknown fields still get a readable label, so adding one to story data
    // needs no change here.
    const spaced = field.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  if (user.about && typeof user.about === "object") {
    const fields = Object.entries(user.about).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    );
    if (fields.length) {
      const about = document.createElement("section");
      about.className = "profile-section about-section";

      const title = document.createElement("h3");
      title.className = "section-title";
      title.textContent = "About";

      const list = document.createElement("dl");
      list.className = "about-list";
      for (const [field, value] of fields) {
        const row = document.createElement("div");
        row.className = "about-row";

        const label = document.createElement("dt");
        label.textContent = aboutLabel(field);

        const text = document.createElement("dd");
        text.textContent = String(value);

        row.append(label, text);
        list.append(row);
      }

      about.append(title, list);
      scroll.append(about);
    }
  }

  view.append(scroll);

  return { element: view, scroll };
}

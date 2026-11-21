// Small shared helper for the message screens. Story data stores image paths
// relative to the story folder, so assetBase turns them into usable URLs.

function urlFor(assetBase, path) {
  if (!path) return "";
  if (/^(?:[a-z]+:|\/)/i.test(path)) return path;
  return assetBase + path;
}

function escapeXml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);
}

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "?";
}

function fallback(name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#d9d9d9"/><text x="40" y="52" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="600" fill="#666">${escapeXml(initials(name))}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function createAvatar(user, assetBase) {
  const name = (user && user.name) || "Unknown";
  const img = document.createElement("img");
  img.className = "avatar";
  img.alt = "";

  const url = urlFor(assetBase, user && user.avatar);
  if (!url) {
    img.src = fallback(name);
  } else {
    img.addEventListener("error", () => { img.src = fallback(name); }, { once: true });
    img.src = url;
  }
  return img;
}

// Displays the optional unsent draft above the message input. The blanks are
// visual only: their ids are kept in the DOM, but nothing can fill them yet.

export function createDraftPanel(draft, { open = false, onToggle = () => {} } = {}) {
  const panel = document.createElement("div");
  panel.className = "draft-panel";

  const bar = document.createElement("button");
  bar.type = "button";
  bar.className = "draft-bar";
  bar.textContent = "1 unsent draft";

  const body = document.createElement("div");
  body.className = "draft-panel-body";

  const inner = document.createElement("div");
  inner.className = "draft-panel-inner";

  const text = document.createElement("p");
  text.className = "draft-text";
  for (const segment of draft.segments || []) {
    if (segment.blank) {
      const blank = document.createElement("span");
      blank.className = "draft-blank";
      blank.dataset.blankId = segment.blank;
      blank.setAttribute("aria-label", "blank");
      blank.textContent = "\u00a0\u00a0\u00a0\u00a0";
      text.append(blank);
    } else {
      text.append(document.createTextNode(segment.text || ""));
    }
  }
  inner.append(text);
  body.append(inner);
  panel.append(bar, body);

  function setOpen(nextOpen, notify = false) {
    const isOpen = Boolean(nextOpen);
    panel.classList.toggle("is-open", isOpen);
    bar.setAttribute("aria-expanded", String(isOpen));
    body.style.maxHeight = isOpen ? `${inner.scrollHeight}px` : "0px";
    if (notify) onToggle(isOpen);
  }

  bar.addEventListener("click", () => setOpen(!panel.classList.contains("is-open"), true));
  setOpen(open);

  // Called again after the panel is in the page so text wraps at the real
  // width and the animation has the correct height.
  return { element: panel, refresh: () => setOpen(panel.classList.contains("is-open")) };
}

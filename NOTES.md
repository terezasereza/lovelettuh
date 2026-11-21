# NOTES.md

## Project
Interactive narrative web game for mobile (QR code -> opens in browser; must also
work on desktop for testing). It imitates a heavily simplified, stylized
Facebook-like social network with custom graphics. By browsing it, the player
learns about one person's life. Theme: love in the digital age. Each story is a
short vignette, a small window into someone's head. Language: English.

## Core idea
- Semi-nonlinear: the player moves freely between tabs (My profile, Direct
  messages, For You feed, ...).
- Some events lock the player into a scene until an interaction is completed
  (e.g. find a crumpled paper in a trash can -> must unfold it by dragging).
- Playful, context-specific interactions/minigames. Their purpose is to
  illustrate the person's mental state, so they differ from story to story.
  Details come later, after the barebones exist.

## Stories (one QR code each)
- Each story is its own subpage/URL (e.g. /stories/cheatcode/), reached by its own QR.
- All stories share the same core: app shell, tabs, base styling, state
  handling, reusable interaction helpers (drag, swipe, unfold).
- Each story has its own: content data, custom graphics, and (optionally)
  its own unique minigames/interactions.

## Tech constraints
- Plain HTML + CSS + JavaScript, no build step, no framework (for now).
- Mobile-first (touch, Pointer Events), also works with mouse on desktop.
- Must load fast and work on iOS Safari and Android Chrome.
- Use `100dvh`; use `touch-action: none` on draggable elements.
- Images: WebP, max ~1000px on the long side.
- Progress saved in localStorage, keyed per story (stories must not overwrite
  each other's saves).

## Structure rules
- Shared code lives in `core/` (shell, tabs, state, reusable interaction
  helpers). Never put story-specific logic in `core/`.
- Each story lives in its own folder `stories/<name>/` with:
  - `story.js` (all texts, who the person is, which tabs/posts exist,
    image paths)
  - `assets/` (that story's graphics)
  - `interactions/` (that story's unique minigames, one file each)
- Game state lives in one central state object.
- Keep files small. Don't rewrite files that weren't part of the request.

## Working rules for the AI agent
- One change per request. Don't refactor unrelated code.
- After each change, briefly explain what changed and why (the user is
  learning and is new to HTML/CSS/JS).
- If something is ambiguous, ask before building.
- Don't add libraries without asking.
- Tell the user how to test each change on a phone.

## Current status
- [x] Barebones: app shell + tab navigation (empty screens)
- [ ] Visual style of the fake social network
- [ ] Story data format (story.js) + loading a story by URL
- [ ] First interaction prototype (paper in trash can, drag + unfold)

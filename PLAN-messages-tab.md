# PLAN: Messages tab

Goal: a chat list + chat view, filled from the per-story data file. One chat can
have an unsent draft with blanks (the blanks become a real mechanic later).
Build in small steps. After each step: test on phone, commit in Git, then continue.
Reuses the `users` "database" and `currentUserId` from PLAN-feed-post.md.

## What this tab contains
- **Chat list:** one row per conversation (avatar, name, last message preview,
  green online dot if the user is online). Tap a row to open the chat.
- **Chat view:** back button, header with avatar + name + online dot, message
  history (my messages on one side, theirs on the other), text input + send.
- **Sending:** the player can type and send messages. They appear immediately.
- **Draft tab (only in chats that have a draft):** directly above the text input
  there is a small bar saying "1 unsent draft". Tapping it expands a panel with a
  few sentences containing blank spaces. Only displaying it for now, filling
  the blanks comes later.
- **Online dot:** green dot next to a user, controllable (see below).

## Design decisions (so the agent doesn't have to guess)

### 1. Data in `stories/<name>/story.js`
- `users`: reused. Add an optional `online: true/false` (starting value).
- `conversations`: array. Each has `id`, `withUserId`, and `messages`.
- Each message: `{ id, senderId, text, time }`. `senderId` is a user id
  (the player's side is `currentUserId`). `time` is just display text
  like "Tue 23:14", not a real date.
- Optional `draft` on a conversation, e.g.:
  `draft: { id: "d1", segments: [ { text: "I never told you that I " }, { blank: "b1" }, { text: " every time we " }, { blank: "b2" }, { text: "." } ] }`
  Blanks are identified by id only. The correct words and the filling logic are
  NOT part of this plan. Do not implement them, but keep the `blank` id.

### 2. State vs. data
- Data = what the author wrote. Never modified by the player.
- State (central state object, saved to localStorage per story):
  - messages the player sent, per conversation
  - which conversations were opened/read (optional, for unread styling)
  - `onlineOverrides`: `{ userId: true/false }`, overrides the starting value
    from data
  - draft state (open/closed, later filled blanks)
- Display = data + state merged at render time.

### 3. Online dot control
- One function in core, e.g. `setOnline(userId, true/false)`, writes to state and
  updates every dot on screen (list and chat header).
- The story code (or a later minigame) can call it at any time, for example to
  switch someone offline after the player does something. No UI button for the
  player.
- For testing, expose it on the browser console (`window.setOnline`).

### 4. Components
- `core/screens/messages.js` (chat list), `core/screens/chat.js` (chat view),
  `core/components/online-dot.js`, `core/components/draft-panel.js`.
- Styles next to them, using the same CSS variables as the feed so restyling
  stays in one place.
- No story-specific logic in `core/`.

## Steps

### Step 1: Data
Add 3-4 conversations to the test story's `story.js` (different users, 3-8
messages each). Give one conversation a `draft` with 2-3 blanks. Give some
users `online: true`. No UI yet.
Test: data loads without console errors.

### Step 2: Chat list
Render the list of conversations from data: avatar, name, last message preview,
online dot. Nothing clickable yet.
Test: looks right on phone, long names/previews are cut off with "..." instead of
breaking the layout.

### Step 3: Open a chat (read only)
Tapping a row opens the chat view with the message history. Back button returns
to the list. Messages from the player are aligned to one side, the other
person's to the other side. The view starts scrolled to the newest message.
Test: open/close several chats; the browser back button doesn't leave the app
in a broken state.

### Step 4: Sending messages
Input field + send button at the bottom. A sent message appears immediately,
the view scrolls down, the input clears. Empty messages are ignored. Saved in
state + localStorage. The chat list preview updates.
Test: send, reload, message is still there; on iOS the keyboard does not cover
the input or break the layout (`100dvh`).

### Step 5: Online dot control
Add `setOnline` + `onlineOverrides` as described above. The dot updates in the
list and in the open chat header.
Test: from the browser console call `setOnline("anna", false)` and watch the
dot change in both places; reload keeps the override.

### Step 6: Draft tab (display only)
In the conversation that has a `draft`: show the "1 unsent draft" bar directly
above the input. Tapping expands a panel (smooth animation) showing the
sentences with visually empty blanks (underlined gaps). Tapping again collapses
it. Blanks are not interactive yet.
Test: expand/collapse works with the keyboard open and closed; long sentences
wrap; chats without a draft show no bar.

### Step 7: Polish and edge cases
- Chat with zero messages
- Very long messages wrap correctly
- Missing avatar fallback
- Optional: typing/send animation

## Out of scope for now
- Filling in the blanks (the actual mechanic, planned later)
- Automatic replies from the other person
- Deleting/editing messages, images, reactions, read receipts
- Real timestamps, group chats

## Open questions for the user
1. Should the other person ever reply to what the player sends? (default: no,
   player messages just appear in the chat)
2. Should the draft bar disappear once the draft is completed or sent? (default:
   decide later together with the blank mechanic)
3. Should the green dot be visible in the chat header too, or only in the list?
   (default: both)

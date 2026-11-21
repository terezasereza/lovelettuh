# PLAN: Feed post template

Goal: a reusable feed post component, filled from a per-story data file.
Build in small steps. After each step: test on phone, commit in Git, then continue.

## What a post contains
- Author: profile picture + user name
- Description text (caption)
- The picture
- Like button (tap to like, tap again to remove the like) + like count
- Comments: list of existing comments + input to add a new one

## Design decisions (so the agent doesn't have to guess)

### 1. Per-story "database" in `stories/<name>/story.js`
- `users`: object keyed by id. Each user has `name` and `avatar` (image path).
  Example: `users: { anna: { name: "Anna Novak", avatar: "assets/anna.webp" } }`
- `currentUserId`: the id of the person whose account the player is browsing.
  Likes and new comments are made as this user.
- `posts`: array. Each post has `id`, `authorId`, `caption`, `image`,
  `likes` (starting number, or list of userIds who liked), `comments`
  (array of `{ id, authorId, text }`).
- Posts and comments only reference users by id, never by copied name/picture.
  Changing a user in one place updates every post.
- Optional `interaction` field on a post (e.g. "trash-paper") is reserved for
  later minigames. Do NOT implement it now, just don't block it.

### 2. State vs. data
- Data (story.js) = what the author wrote. Never modified by the player.
- State = what the player did: which posts are liked, which comments they added.
  Stored in the central state object and saved to localStorage keyed per story.
- Display = data + state merged at render time.

### 3. Component
- `core/components/post.js` exports a function that takes one post object and
  returns the post's HTML element. No story-specific logic inside.
- Styles in `core/components/post.css`, using CSS variables for colors/sizes
  so the Facebook-like look can be restyled later in one place.

## Steps

### Step 1: Data structure
Create `story.js` for one test story with 2-3 users and 3 posts (use
placeholder images). No UI yet.
Test: open the browser console, check the data loads without errors.

### Step 2: Static post rendering
Build `post.js` + `post.css`. Render all posts into the feed screen from the
data. Author name and avatar are looked up from `users` by `authorId`.
Show picture, caption, like count, existing comments. Nothing clickable yet.
Test: feed looks right on phone, long captions and long names don't break layout.

### Step 3: Like button
Tap toggles like on/off, count updates (+1 / -1), button visually changes.
Liked state saved in state + localStorage.
Test: like, reload page, like is still there; unlike works; double-tapping
quickly doesn't break the count.

### Step 4: Add comments
Input field + send button under each post. New comment appears in the list
immediately, authored by `currentUserId` (avatar + name shown like others).
Comments saved in state + localStorage. Empty comments are ignored.
Test: add a comment, reload, still there; iOS keyboard doesn't cover the input
or push the layout around badly.

### Step 5: Polish and edge cases
- Posts with zero likes / zero comments
- Missing avatar or image (show a fallback instead of a broken icon)
- Very long comment text wraps correctly
- Small like animation (optional)

## Out of scope for now
- Deleting or editing comments
- Replies to comments
- Post interactions/minigames (only keep the `interaction` field open)
- Other tabs (messages, profile)

## Open questions for the user
1. Should the player's own comments be removable? (default: no)
2. Are likes just a number, or should the post show who liked? (default: number)
3. Should existing comments by story characters be able to change depending on
   the story's progress? (default: no, fixed text)

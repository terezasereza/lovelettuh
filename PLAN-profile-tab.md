# PLAN: Profile tab

Goal: one reusable profile screen that shows the player's own profile in the
"My profile" tab, and the same screen for any friend they tap on.
Build in small steps. After each step: test on phone, commit in Git, then continue.
Reuses `users`, `currentUserId`, the post component (PLAN-feed-post.md) and the
online dot (PLAN-messages-tab.md).

## What a profile contains
- **Cover photo:** the wide banner image at the top. (On Facebook it's called the
  "cover photo". The list of posts below it was historically called the
  "timeline".)
- **Profile picture** overlapping the bottom edge of the cover
- **Name** and the **green online dot** (same dot and same control as in messages)
- **About (optional):** short info rows such as "Lives in ..." or
  "Relationship status ...". Only shown for users who have such info, only the
  rows they have.
- **Friends:** a small preview of a few friends (avatar + name). Tapping one
  opens that friend's profile.
- **Posts** shared on this profile, newest first, rendered with the same post
  component as the feed.

## Design decisions (so the agent doesn't have to guess)

### 1. One screen, any user
- `core/screens/profile.js` takes a `userId` and renders that user's profile.
- "My profile" tab = `profile(currentUserId)`.
- Tapping a friend = `profile(friendId)`. Same code, different data.
- No separate code for "own" vs. "friend's" profile, except hiding things that
  only make sense for yourself (nothing yet).

### 2. Data in `stories/<name>/story.js`
- Extend `users` entries with: `cover` (image path), `friends` (array of user
  ids), optional `bio` (short text).
- Optional `about` object on a user, every field inside it optional too, e.g.
  `about: { livesIn: "Brno", relationship: "In a relationship with Tom" }`.
  Like on Facebook, nobody is required to have it: a user can have no `about`
  at all, or only some fields. The UI renders only what exists.
  Possible fields: `livesIn`, `from`, `works`, `studied`, `relationship`.
  More fields can be added later without code changes to existing users.
  These rows are likely places where words for the draft blanks will be
  hidden later. The hiding mechanic itself is NOT part of this plan.
- Posts on a profile = all posts where `authorId` equals that user's id. No
  separate list to maintain.
- Friends are only ids. Name and picture are looked up from `users`, so one
  change updates everywhere.

### 3. Navigation
- Tabs (feed, messages, my profile, ...) stay as they are.
- Opening a friend's profile pushes a new view on top of the current tab with a
  back button. Back returns to where the player came from (e.g. my profile).
- Friends can be opened from friends' profiles too (profile -> friend ->
  friend of friend). Back goes one step at a time.
- The browser back button must work sensibly and not leave the app in a broken
  state.
- Which profile is being viewed is kept in the central state object
  (not saved to localStorage; on reload the player lands on a tab).

### 4. State
- The online dot uses `onlineOverrides` from the messages plan. Nothing new.
- Likes and comments on posts shown on a profile use the same state as in the
  feed. Liking a post on a profile also shows as liked in the feed.

## Steps

### Step 1: Data
Add `cover`, `friends` and `bio` to the users in the test story. Add `about`
only to some users, and give those different sets of fields (not everyone, not
all fields). Make sure the player's user has 3-5 friends, some friends have
their own friends, and give 2 posts to the player and 1-2 to some friends. No
UI yet.
Test: data loads without console errors.

### Step 2: Profile header
Render cover, overlapping profile picture, name, online dot, optional bio, for
`currentUserId` in the "My profile" tab.
Test: looks right on phone; a long name doesn't break the layout; missing cover
or avatar shows a fallback instead of a broken icon.

### Step 3: About section (optional per user)
Under the header, show an "About" block with one row per field the user
actually has in `about` (e.g. "Lives in Brno", "In a relationship with
Tom"). Rows for missing fields are not rendered at all. If a user has no
`about` or it is empty, the whole About block is hidden (no empty box, no
"not specified" text).
Test: one user with all fields, one with only one field, one with none; the
layout looks right in all three cases and nothing is shown for missing data.

### Step 4: Friends preview
Add a friends section under the About block (or under the header if the About
block is hidden): a row or small grid of avatars with
names, taken from `friends`. Nothing clickable yet.
Test: works with 0, 1 and 8 friends; names that are too long get cut off with "...".

### Step 5: Posts on the profile
Under the friends section, render this user's posts with the existing post
component, newest first. Likes and comments work like in the feed.
Test: like a post on the profile, switch to the feed, it is liked there too. A
user with no posts shows a short empty message.

### Step 6: Open a friend's profile
Tapping a friend opens `profile(friendId)` with a back button. Friends of
friends work too. Back goes one step at a time.
Test: go profile -> friend -> friend of friend -> back, back; also with the
browser back button; scroll position of the previous screen is kept if possible.

### Step 7: Polish and edge cases
- A profile that links to itself (a user listed in their own friends)
- Friend ids that don't exist in `users` (skip them instead of crashing)
- Smooth transition when opening/closing a profile (optional)

## Out of scope for now
- Editing the profile, adding/removing friends, friend requests
- Editing the About info, or a full Facebook-style About page with sub-tabs
- Photos tab, followers, profile tabs
- Hidden words/items on profiles for the draft mechanic (planned later)

## Open questions for the user
1. Should every friend be tappable, or only some? (default: every friend in
   the `friends` list is tappable)
2. Should a friend's profile look exactly like the player's, or simpler (e.g.
   fewer details)? (default: identical layout)
3. Can the player message someone from their profile (a "Message" button that
   opens the chat)? (default: no, add later if wanted)

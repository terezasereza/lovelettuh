// Test story for the feed. This file is the authored data.
// The player never edits it. Their likes and comments live in state.
// Paths are relative to this story folder (stories/anna/).

export const story = {
  id: "anna",
  currentUserId: "anna",
  users: {
    anna: {
      name: "Anna Novak",
      avatar: "assets/anna.svg",
    },
    mira: {
      name: "Mira Chen",
      avatar: "assets/mira.svg",
    },
    leo: {
      name: "Leo Bartholomew-Langworth",
      avatar: "assets/leo.svg",
    },
  },
  posts: [
    {
      id: "left-on-read",
      authorId: "anna",
      caption: "He left this on read for six hours. I still checked if the little dot was green.",
      image: "assets/read-receipt.svg",
      likes: 18,
      comments: [
        { id: "c1", authorId: "mira", text: "Put the phone in another room." },
        { id: "c2", authorId: "leo", text: "A green dot is not a personality." },
      ],
      // Reserved for a later minigame. The feed ignores this field for now.
      interaction: "trash-paper",
    },
    {
      id: "unsent-note",
      authorId: "leo",
      caption:
        "I recorded a voice note on the walk home, the one where I finally say I miss her without joking, and then I stood outside my building and played it back twice. My voice sounded like someone asking a stranger for a favor. I deleted it before the elevator doors opened. The draft is gone and I still know every sentence, which feels worse than sending it.",
      image: "assets/voice-note.svg",
      likes: 4,
      comments: [
        {
          id: "c3",
          authorId: "anna",
          text: "I have a whole album of those. They live in my head with the file name still on them, like unsaved tabs I am afraid to close in case the wording was finally honest.",
        },
      ],
    },
    {
      id: "new-plant",
      authorId: "mira",
      caption: "New plant. Don't name it.",
      image: "assets/plant.svg",
      likes: 0,
      comments: [],
    },
  ],
};

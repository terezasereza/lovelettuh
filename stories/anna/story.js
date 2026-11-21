// Test story for the feed. This file is the authored data.
// The player never edits it. Their likes and comments live in state.
// Paths are relative to this story folder (stories/anna/).

export const story = {
  id: "anna",
  currentUserId: "anna",
  // Users referenced by id everywhere else. Cover, bio, about and friends are
  // all optional: the profile screen renders only what is present.
  users: {
    anna: {
      name: "Anna Novak",
      avatar: "assets/anna.svg",
      cover: "assets/cover.svg",
      online: true,
      bio: "Reading other people's messages like weather reports.",
      about: {
        livesIn: "Brno",
        works: "Bookseller at a shop that smells like paper",
        relationship: "It's complicated",
      },
      friends: ["mira", "leo", "noor", "jules", "sam"],
    },
    mira: {
      name: "Mira Chen",
      avatar: "assets/mira.svg",
      cover: "assets/cover.svg",
      online: true,
      bio: "Keeping things alive, mostly.",
      about: {
        livesIn: "Brno",
        from: "Taipei",
        works: "Designing signs for people who are lost",
        studied: "Graphic design",
        relationship: "Single, apparently",
      },
      friends: ["anna", "leo", "noor", "jules", "sam", "priya", "tom", "elena"],
    },
    leo: {
      name: "Leo Bartholomew-Langworth",
      avatar: "assets/leo.svg",
      // No cover on purpose: the profile should draw a fallback banner.
      online: false,
      bio: "Drafts are letters I didn't deserve to send.",
      about: { relationship: "In a relationship with Anna" },
      // Self-link and unknown id are here to check that the UI skips them.
      friends: ["leo", "anna", "ghost-user"],
    },
    noor: {
      name: "Noor Haddad",
      avatar: "assets/noor.svg",
      cover: "assets/cover.svg",
      online: true,
      friends: [],
    },
    jules: {
      name: "Jules",
      // No avatar on purpose: the profile should draw an initials fallback.
      cover: "assets/cover.svg",
      about: {},
      friends: ["anna"],
    },
    sam: {
      name: "Samantha-Rose Fitzgerald-Okafor",
      cover: "assets/cover.svg",
      about: { from: "Glasgow" },
      friends: ["anna", "mira"],
    },
    priya: { name: "Priya" },
    tom: { name: "Tom" },
    elena: { name: "Elena" },
  },
  // Authored newest first. A profile shows the posts whose authorId matches.
  posts: [
    {
      id: "small-kindness",
      authorId: "anna",
      caption: "Bought myself flowers. They are not an apology, they are just flowers.",
      image: "assets/plant.svg",
      likes: 3,
      comments: [
        { id: "c4", authorId: "noor", text: "This is the correct amount of flowers." },
      ],
    },
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
      id: "sunday-plans",
      authorId: "mira",
      caption: "Sunday: book club, then pretending I don't check my phone at the table.",
      image: "assets/read-receipt.svg",
      likes: 7,
      comments: [],
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

  // Conversations are authored data. Messages the player sends are kept in
  // state instead, so this array never changes.
  conversations: [
    {
      id: "mira-chat",
      withUserId: "mira",
      messages: [
        { id: "m1", senderId: "mira", text: "You okay? You've been quiet since Tuesday.", time: "Tue 18:02" },
        { id: "m2", senderId: "anna", text: "Yeah. Just tired.", time: "Tue 18:04" },
        { id: "m3", senderId: "mira", text: "That's the same thing you said last week.", time: "Tue 18:05" },
        { id: "m4", senderId: "anna", text: "I know. I'm working on it.", time: "Tue 18:07" },
        { id: "m5", senderId: "mira", text: "The plant is still alive, by the way.", time: "Tue 18:08" },
        { id: "m6", senderId: "anna", text: "See? You can keep something alive.", time: "Tue 18:09" },
      ],
    },
    {
      id: "leo-chat",
      withUserId: "leo",
      messages: [
        { id: "l1", senderId: "anna", text: "Are we okay?", time: "Wed 22:11" },
        { id: "l2", senderId: "leo", text: "Yeah. Of course.", time: "Wed 22:14" },
        { id: "l3", senderId: "anna", text: "You left me on read for six hours.", time: "Wed 22:15" },
        { id: "l4", senderId: "leo", text: "I was thinking about what to say.", time: "Wed 22:17" },
        { id: "l5", senderId: "anna", text: "That long?", time: "Wed 22:18" },
        { id: "l6", senderId: "leo", text: "I keep writing things and deleting them.", time: "Wed 22:20" },
        { id: "l7", senderId: "anna", text: "Then write something small.", time: "Wed 22:21" },
        { id: "l8", senderId: "leo", text: "Okay.", time: "Wed 22:23" },
      ],
      // The blanks become a mechanic later. Only their ids matter for now.
      draft: {
        id: "d1",
        segments: [
          { text: "I never told you that I " },
          { blank: "b1" },
          { text: " every time we " },
          { blank: "b2" },
          { text: "." },
        ],
      },
    },
    {
      id: "noor-chat",
      withUserId: "noor",
      messages: [
        { id: "n1", senderId: "noor", text: "Hey, is this Anna from the book club?", time: "Fri 09:31" },
        { id: "n2", senderId: "anna", text: "It is. Sorry, I lost my phone for a week.", time: "Fri 09:36" },
        { id: "n3", senderId: "noor", text: "No worries. We're doing Sunday again?", time: "Fri 09:38" },
        { id: "n4", senderId: "anna", text: "I think so.", time: "Fri 09:40" },
        { id: "n5", senderId: "noor", text: "Cool. I'll send the address.", time: "Fri 09:41" },
      ],
    },
  ],
};

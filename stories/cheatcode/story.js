// Test story for the feed. This file is the authored data.
// The player never edits it. Their likes and comments live in state.
// Paths are relative to this story folder (stories/cheatcode/).

export const story = {
  id: "cheatcode",
  currentUserId: "olivia",
  // Users referenced by id everywhere else. Cover, bio, about and friends are
  // all optional: the profile screen renders only what is present.
  users: {
    olivia: {
      name: "Olivia Bagley",
      avatar: "assets/oliviapfp.jpg",
      cover: "assets/oliviabg.jpg",
      online: true,
      bio: "Reading other people's messages like weather reports.",
      about: {
        livesIn: "Brno",
        works: "Bookseller at a shop that smells like paper",
        relationship: "It's complicated",
      },
      friends: ["ari", "leo", "noor", "jules", "sam"],
    },
    ari: {
      name: "Ari.Skinnyglam",
      avatar: "assets/aripfp.jpg",
      cover: "assets/aribg.jpg",
      online: false,
      bio: "Keeping things alive, mostly.",
      about: {
        livesIn: "Brno",
        from: "Taipei",
        works: "Designing signs for people who are lost",
        studied: "Graphic design",
        relationship: "Single, apparently",
      },
      friends: ["olivia", "leo", "noor", "jules", "sam", "priya", "tom", "elena"],
    },
    leo: {
      name: "Leo Bartholomew-Langworth",
      avatar: "assets/leo.svg",
      // No cover on purpose: the profile should draw a fallback banner.
      online: false,
      bio: "Drafts are letters I didn't deserve to send.",
      about: { relationship: "In a relationship with olivia" },
      // Self-link and unknown id are here to check that the UI skips them.
      friends: ["leo", "olivia", "ghost-user"],
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
      friends: ["olivia"],
    },
    sam: {
      name: "Samantha-Rose Fitzgerald-Okafor",
      cover: "assets/cover.svg",
      about: { from: "Glasgow" },
      friends: ["olivia", "ari"],
    },
    priya: { name: "Priya" },
    tom: { name: "Tom" },
    elena: { name: "Elena" },
    },
    queernews: {
        name: "queer.news",
        avatar: "assets/longbaconstore.jpg",
        cover: "assets/longbaconstore.jpg",
        about: {},
        friends: [],
    },
    kikichi: {
        name: "kikichi.official",
        avatar: "assets/kikichi-concert.jpg",
        cover: "assets/kikichi-concert.jpg",
        about: {},
        friends: [],
    },
  // Authored newest first. A profile shows the posts whose authorId matches.
  posts: [
    {
      id: "olivia-changed-pfp",
      authorId: "olivia",
          caption: "Olivia Bagley has just changed their profile image.",
      image: "assets/oliviapfp.jpg",
      likes: 2,
      comments: [
        { id: "c4", authorId: "ari", text: "SICKKK!!" },
      ],
    },
    /*{
      id: "left-on-read",
      authorId: "olivia",
      caption: "He left this on read for six hours. I still checked if the little dot was green.",
      image: "assets/read-receipt.svg",
      likes: 18,
      comments: [
        { id: "c1", authorId: "ari", text: "Put the phone in another room." },
        { id: "c2", authorId: "leo", text: "A green dot is not a personality." },
      ],
      // Reserved for a later minigame. The feed ignores this field for now.
      interaction: "trash-paper",
    },
    */
    {
      id: "kikichi-concert",
      authorId: "ari",
        caption: "I WAS AT KIKICHI CONCERT TODAY!! That was so insanely awesome, I think I might lose my shit for next 2 weeks or so xp. Don't lose meee people okay??",
        image: "assets/kikichi-concert.jpg",
      likes: 13,
      comments: [],
    },
    {
      id: "tyler-gay",
      authorId: "queernews",
      caption:
        "Tyler Stan came out as homosexual in his last interview! He's one of us :)! Tyler Stan, the lead singer of 'Two Steps Away', 2017 Grammy nomenee, whose single 'Get out'(2005) is one of the most listened singles of all time recently has opened up about his sexuality on the Cheesy Podcast hosted by queer community. Welcome, Tyler!",
      image: "assets/tylergay.jpg",
        likes: 3479,
      comments: [
        {
          id: "c3",
          authorId: "leo",
          text: "i knew it! god he is soooo hot",
        },
      ],
      },
        id: "kikichi-announcement",
        authorId: "kikichi",
        caption:
      "WAITING YOU IN HOT HOT SPAIN CUTIES AND PIES! GET YOUR LAST TICKETS, JUST A DAY LEFT! YASS RIGHT HERE!! Tickets -> www.kikichi.tickets.com",
        image: "assets/kikichi-concert.jpg",
        likes: 87 534,
        comments: [
            {
                id: "c3",
                authorId: "ari",
                text: "!!!!!!!!!!!!!",
            },
        ],
    },
  ],

  // Conversations are authored data. Messages the player sends are kept in
  // state instead, so this array never changes.
  conversations: [
    {
      id: "ari-chat",
      withUserId: "ari",
      // Entries with only an id + date are date dividers, not messages.
      // The transcript has dates but no per-message times, so times are omitted.
      messages: [
        { id: "a-date-08", date: "08.12.2018" },
        { id: "a1", senderId: "ari", text: "hey, wanna hop on a call?" },
        { id: "a2", senderId: "ari", text: "i shud be free till 5!" },
        { id: "a3", senderId: "olivia", text: "sure! gimme a minute" },

        { id: "a-date-15", date: "15.12.2018" },
        { id: "a4", senderId: "ari", text: "LOL he's just like me fr." },
        { id: "a5", senderId: "olivia", text: "frrr" },
        { id: "a6", senderId: "ari", text: "you doing anything during new years?" },
        { id: "a7", senderId: "olivia", text: "maybe something with family" },
        { id: "a8", senderId: "ari", text: "eeyy" },
        { id: "a9", senderId: "ari", text: "I wish I could come" },
        { id: "a10", senderId: "ari", text: "So we could celebrate together some time <33" },
        { id: "a11", senderId: "olivia", text: ":(" },
        { id: "a12", senderId: "ari", text: "Gonna make it my new year wish so we finally live together!!" },
        { id: "a13", senderId: "olivia", text: "awhhh STAP !!" },
        { id: "a14", senderId: "olivia", text: "im gonna make a wish so you become tiny and I carry you in my pocket everywhere" },
        { id: "a15", senderId: "ari", text: "LOL says the tiny you" },
        { id: "a16", senderId: "olivia", text: "-_- mmywah" },
        { id: "a17", senderId: "ari", text: ":(" },
        { id: "a18", senderId: "ari", text: "internet hug" },
        { id: "a19", senderId: "olivia", text: "dodges internet hug and passionately kisses instead" },
        { id: "a20", senderId: "ari", text: "LOL stfuuuu xD" },
        { id: "a21", senderId: "olivia", text: ":]" },

        { id: "a-date-19", date: "19.12.2018" },
        { id: "a22", senderId: "ari", text: "SHELLY GIRL YOU KNOW WHAT HAPPENED" },
        { id: "a23", senderId: "ari", text: "MY PARENTS GOT ME A TICKET!!" },

        { id: "a-date-20", date: "20.12.2018" },
        { id: "a24", senderId: "ari", text: "For Kikichi girl!" },
        { id: "a25", senderId: "ari", text: "heyooo" },

        { id: "a-date-25", date: "25.12.2018" },
        { id: "a26", senderId: "ari", text: "u thereee??" },
        { id: "a27", senderId: "ari", text: "Im worried" },
        { id: "a28", senderId: "ari", text: "Merry Xmas btw" },

        { id: "a-date-31", date: "31.12.2018" },
        { id: "a29", senderId: "ari", text: "I am pissed that you're leaving me on a new year like this. What;s your problem with just checking in?? I see you're online. Leaving me without any explanation is just low." },
        { id: "a30", senderId: "ari", text: "Happy new year. Hope I can get a text from you sometime soon. I don't understand what have I done :(" },
        { id: "a31", senderId: "ari", text: "Please just tell me where you are." },
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
      id: "leo-chat",
      withUserId: "leo",
      messages: [
        { id: "l1", senderId: "olivia", text: "Are we okay?", time: "Wed 22:11" },
        { id: "l2", senderId: "leo", text: "Yeah. Of course.", time: "Wed 22:14" },
        { id: "l3", senderId: "olivia", text: "You left me on read for six hours.", time: "Wed 22:15" },
        { id: "l4", senderId: "leo", text: "I was thinking about what to say.", time: "Wed 22:17" },
        { id: "l5", senderId: "olivia", text: "That long?", time: "Wed 22:18" },
        { id: "l6", senderId: "leo", text: "I keep writing things and deleting them.", time: "Wed 22:20" },
        { id: "l7", senderId: "olivia", text: "Then write something small.", time: "Wed 22:21" },
        { id: "l8", senderId: "leo", text: "Okay.", time: "Wed 22:23" },
      ],
    },
    {
      id: "noor-chat",
      withUserId: "noor",
      messages: [
        { id: "n1", senderId: "noor", text: "Hey, is this olivia from the book club?", time: "Fri 09:31" },
        { id: "n2", senderId: "olivia", text: "It is. Sorry, I lost my phone for a week.", time: "Fri 09:36" },
        { id: "n3", senderId: "noor", text: "No worries. We're doing Sunday again?", time: "Fri 09:38" },
        { id: "n4", senderId: "olivia", text: "I think so.", time: "Fri 09:40" },
        { id: "n5", senderId: "noor", text: "Cool. I'll send the address.", time: "Fri 09:41" },
      ],
    },
  ],
};

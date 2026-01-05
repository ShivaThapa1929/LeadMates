export default {
  state: {
    settingToggle: false,
    openinfo: true,
    activechat: false,
    searchContact: "",
    mobileChatSidebar: false,
    profileinfo: {},
    messFeed: [],
    user: {},
    contacts: [
      {
        id: 1,
        fullName: "Kathryn Murphy",
        role: "Frontend Developer",
        lastmessage: "Hey! there I'm available",
        lastmessageTime: "2:30 PM",
        unredmessage: Math.floor(Math.random() * 10),
        avatar: require("@/assets/images/users/user-2.jpg"),
        status: "offline",
      },
      {
        id: 2,
        fullName: "Felecia Rower",
        role: " UI/UX Designer",
        lastmessage: "Hey! there I'm available",
        lastmessageTime: "2:30 PM",
        unredmessage: Math.floor(Math.random() * 10),
        avatar: require("@/assets/images/users/user-3.jpg"),
        status: "active",
      },
      {
        id: 3,
        fullName: " Aileen Chavez",
        role: " Backend Developer",
        lastmessage: "Hey! there I'm available",
        lastmessageTime: "2:30 PM",
        unredmessage: Math.floor(Math.random() * 10),
        avatar: require("@/assets/images/users/user-4.jpg"),
        status: "offline",
      },
      {
        id: 4,
        fullName: "Alec Thompson",
        role: " Full Stack Developer",
        lastmessage: "Hey! there I'm available",
        lastmessageTime: "2:30 PM",
        unredmessage: Math.floor(Math.random() * 10),
        avatar: require("@/assets/images/users/user-5.jpg"),
        status: "active",
      },
      {
        id: 5,
        fullName: "Murphy Aileen",
        role: "Frontend Developer",
        lastmessage: "Hey! there I'm available",
        lastmessageTime: "2:30 PM",
        unredmessage: Math.floor(Math.random() * 10),
        avatar: require("@/assets/images/users/user-6.jpg"),
        status: "offline",
      },
    ],
    chats: [
      {
        id: 1,
        userId: 1,
        messages: [
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Hey! How are you?",
            time: "10:00",
            sender: "them",
          },
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Good, I will book the meeting room for you.",
            time: "10:02",

            sender: "them",
          },
          {
            content: "Hi, I am good, what about you?",
            img: require("@/assets/images/users/user-1.jpg"),
            time: "10:01",
            sender: "me",
          },

          {
            content: "Thanks, It will be great.",
            img: require("@/assets/images/users/user-1.jpg"),
            time: "10:03",
            sender: "me",
          },
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Hey! How are you?",
            time: "10:00",
            sender: "them",
          },
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Good, I will book the meeting room for you.",
            time: "10:02",

            sender: "them",
          },
          {
            content: "Hi, I am good, what about you?",
            img: require("@/assets/images/users/user-1.jpg"),
            time: "10:01",
            sender: "me",
          },

          {
            content: "Thanks, It will be great.",
            img: require("@/assets/images/users/user-1.jpg"),
            time: "10:03",
            sender: "me",
          },
        ],
      },
      {
        id: 2,
        userId: 2,
        messages: [
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Hey! How are you?",
            time: "10:00",
            sender: "them",
          },
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Good, I will book the meeting room for you.",
            time: "10:02",

            sender: "them",
          },
        ],
      },
      {
        id: 3,
        userId: 3,
        messages: [
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Hey! How are you?",
            time: "10:00",
            sender: "them",
          },
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Good, I will book the meeting room for you.",
            time: "10:02",

            sender: "me",
          },
        ],
      },
      {
        id: 4,
        userId: 4,
        messages: [
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Hey! How are you?",
            time: "10:00",
            sender: "me",
          },
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Good, I will book the meeting room for you.",
            time: "10:02",

            sender: "them",
          },
        ],
      },
      {
        id: 5,
        userId: 5,
        messages: [
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Hey! How are you?",
            time: "10:00",
            sender: "them",
          },
          {
            img: require("@/assets/images/users/user-2.jpg"),
            content: "Good, I will book the meeting room for you.",
            time: "10:02",

            sender: "them",
          },
        ],
      },
    ],
  },
  getters: {
    getprofileinfo: (state) => state.profileinfo,
    // get contacts with search
    getContacts: (state) => {
      if (state.searchContact) {
        return state.contacts.filter((contact) =>
          contact.fullName
            .toLowerCase()
            .includes(state.searchContact.toLowerCase())
        );
      } else {
        return state.contacts;
      }
    },
    getChats: (state) => state.chats,
    // messFeed
    getMessFeed: (state) => state.messFeed,
    // get user
    getUser: (state) => state.user,
  },
  mutations: {
    toggleuserSetting(state) {
      state.settingToggle = !state.settingToggle;
    },
    sendMessage(state, payload) {
      state.messFeed.push(payload);
    },
    //openinfo
    openinfo(state) {
      state.openinfo = !state.openinfo;
    },
    //open chat
    openChat(state, data) {
      state.activechat = true;
      state.mobileChatSidebar = false;
      state.user = data;
      state.chats.map((item) => {
        if (item.userId === data.id) {
          state.messFeed = item.messages;
        }
      });
    },
    openMobileSidebar(state) {
      state.mobileChatSidebar = !state.mobileChatSidebar;
    },
  },
  actions: {
    // commit settingToggle
    toggleuserSetting({ commit }) {
      commit("toggleuserSetting");
    },
    // send message
    sendMessage({ commit }, payload) {
      commit("sendMessage", payload);
    },
    openinfo({ commit }) {
      commit("openinfo");
    },
    openChat({ commit }, data) {
      commit("openChat", data);
    },
    openMobileSidebar({ commit }) {
      commit("openMobileSidebar");
    },
  },
};

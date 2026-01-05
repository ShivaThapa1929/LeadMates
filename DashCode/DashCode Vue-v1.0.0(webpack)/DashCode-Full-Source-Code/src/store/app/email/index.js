import { v4 as uuidv4 } from "uuid";
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  state: {
    addModal: false,
    search: "",
    singleEmailModal: false,
    mobileEmailSidebar: false,
    storeEmail: {},
    isCheckAll: false,
    emailLoading: false,
    trashEmails: [],
    emails: [
      {
        id: uuidv4(),
        image: require("@/assets/images/avatar/av-1.svg"),
        title: "Pay bills & win up to 600$ Cashback! ",
        desc: " - Congratulations on your iRun Coach subscription. You made no space for excuses and you decided on a healthier and happier life...",
        isfav: false,
        sent: false,
        draft: true,
        spam: false,
        trash: false,
        personal: false,
        social: true,
        promotions: true,
        lastime: "12:20 pm",
        busines: true,
        checked: false,
        isread: false,
        isspam: true,
        isdelate: false,
      },
      {
        id: uuidv4(),
        image: require("@/assets/images/avatar/av-2.svg"),
        title: "Pay bills & win up to 600$ Cashback! ",
        desc: " - Congratulations on your iRun Coach subscription. You made no space for excuses and you decided on a healthier and happier life...",
        isfav: true,
        sent: false,
        draft: false,
        spam: false,
        trash: false,
        personal: false,
        social: false,
        promotions: false,
        lastime: "12:20 pm",
        checked: false,
        busines: false,
        isread: false,
        isspam: true,
        isdelate: false,
      },
      {
        id: uuidv4(),
        image: require("@/assets/images/avatar/av-3.svg"),
        title: "1-Pay bills & win up to 600$ Cashback! ",
        desc: " - Congratulations on your iRun Coach subscription. You made no space for excuses and you decided on a healthier and happier life...",
        isfav: true,
        sent: false,
        draft: true,
        spam: false,
        trash: false,
        personal: true,
        social: false,
        promotions: false,
        lastime: "12:20 pm",
        checked: false,
        busines: false,
        isread: false,
        isspam: false,
        isdelate: false,
      },
      {
        id: uuidv4(),
        image: require("@/assets/images/avatar/av-2.svg"),
        title: "1-Pay bills & win up to 600$ Cashback! ",
        desc: " - Congratulations on your iRun Coach subscription. You made no space for excuses and you decided on a healthier and happier life...",
        isfav: true,
        sent: true,
        draft: false,
        spam: false,
        trash: false,
        personal: true,
        social: false,
        promotions: false,
        lastime: "12:20 pm",
        checked: false,
        busines: false,
        isread: false,
        isspam: false,
        isdelate: false,
      },
    ],
  },
  getters: {
    // loading
    emailLoading: (state) => state.emailLoading,

    // addmodals
    addModal: (state) => state.addModal,
    // emails with search
    emails: (state) =>
      state.search === ""
        ? state.emails
        : state.emails.filter((item) => {
            return item.title
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(state.search.toLowerCase().replace(/\s+/g, ""));
          }),
    // fav email with search
    favEmails: (state) =>
      state.search === ""
        ? state.emails.filter((item) => item.isfav === true)
        : state.emails
            .filter((item) => item.isfav === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.search.toLowerCase().replace(/\s+/g, ""));
            }),
    // sent email with search
    sentEmails: (state) =>
      state.search === ""
        ? state.emails.filter((item) => item.sent === true)
        : state.emails
            .filter((item) => item.sent === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.search.toLowerCase().replace(/\s+/g, ""));
            }),
    // draft email with search
    draftEmails: (state) =>
      state.search === ""
        ? state.emails.filter((item) => item.draft === true)
        : state.emails
            .filter((item) => item.draft === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.search.toLowerCase().replace(/\s+/g, ""));
            }),
    // personal email with search
    personalEmails: (state) =>
      state.search === ""
        ? state.emails.filter((item) => item.personal === true)
        : state.emails
            .filter((item) => item.personal === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.search.toLowerCase().replace(/\s+/g, ""));
            }),
    // social email with search
    socialEmails: (state) =>
      state.search === ""
        ? state.emails.filter((item) => item.social === true)
        : state.emails
            .filter((item) => item.social === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.search.toLowerCase().replace(/\s+/g, ""));
            }),
    // promotions email with search
    promotionsEmails: (state) =>
      state.search === ""
        ? state.emails.filter((item) => item.promotions === true)
        : state.emails
            .filter((item) => item.promotions === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.search.toLowerCase().replace(/\s+/g, ""));
            }),
    // busines email with search
    businesEmails: (state) =>
      state.search === ""
        ? state.emails.filter((item) => item.busines === true)
        : state.emails
            .filter((item) => item.busines === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.search.toLowerCase().replace(/\s+/g, ""));
            }),
    // span email with search
    spamEmails: (state) =>
      state.search === ""
        ? state.emails.filter((item) => item.isspam === true)
        : state.emails
            .filter((item) => item.isspam === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.search.toLowerCase().replace(/\s+/g, ""));
            }),
    trashEmails: (state) =>
      state.search === ""
        ? state.trashEmails
        : state.trashEmails.filter((item) => {
            return item.title
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(state.search.toLowerCase().replace(/\s+/g, ""));
          }),
  },
  mutations: {
    //openEmail
    openEmail(state) {
      state.addModal = true;
    },
    // sendEmail
    sendEmail(state, payload) {
      state.emails.unshift(payload);
      state.emailLoading = true;
      setTimeout(() => {
        state.emailLoading = false;
        toast.success -
          500("Email Send", {
            timeout: 2000,
          });
      }, 1500);
    },
    // deleteEmail
    deleteEmail(state, payload) {
      var emails = state.emails;
      emails.splice(emails.indexOf(payload), 1);
      // store email delatedEmails
      state.trashEmails.unshift(payload);
      toast.error("Email Delate", {
        timeout: 2000,
      });
    },
    // checkAll
    checkAll(state) {
      state.isCheckAll = !state.isCheckAll;
      state.emails.forEach((item) => {
        item.checked = state.isCheckAll;
      });
    },
    openSingle(state, payload) {
      state.storeEmail = payload;
      state.singleEmailModal = !state.singleEmailModal;
      payload.isread = true;
    },
    openMobileEmailSidebar(state) {
      state.mobileEmailSidebar = !state.mobileEmailSidebar;
    },
    closeMobileEmailSidebar(state) {
      state.mobileEmailSidebar = false;
    },
    closeDetailsEmail(state) {
      state.singleEmailModal = false;
    },
  },
  actions: {
    openEmail({ commit }) {
      commit("openEmail");
    },
    // sendEmail
    sendEmail({ commit }, payload) {
      commit("sendEmail", payload);
    },
    // deleteEmail
    deleteEmail({ commit }, payload) {
      commit("deleteEmail", payload);
    },
    // check all  commit
    checkAll({ commit }) {
      commit("checkAll");
    },
    openSingle({ commit }, payload) {
      commit("openSingle", payload);
    },
    openMobileEmailSidebar({ commit }) {
      commit("openMobileEmailSidebar");
    },
    closeMobileEmailSidebar({ commit }) {
      commit("openMobileEmailSidebar");
    },
    closeDetailsEmail({ commit }) {
      commit("closeDetailsEmail");
    },
  },
};

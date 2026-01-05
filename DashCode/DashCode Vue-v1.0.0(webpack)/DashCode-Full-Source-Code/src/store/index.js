import { createStore } from "vuex";
import chat from "./app/chat";
import email from "./app/email";
import kanban from "./app/kanban";
import project from "./app/project";
import apptodo from "./app/todo";
export default createStore({
  state: {
    sidebarCollasp: false,
    sidebarHidden: false,
    mobielSidebar: false,
    semidark: false,
    semiDarkTheme: "semi-light",
    isDark: false,
    skin: "default",
    theme: "light",
    isOpenSettings: false,
    cWidth: "full",
    menuLayout: "vertical",
    navbarType: "sticky",
    footerType: "static",
    chartColors: {
      title: "red",
    },
  },
  getters: {
    theme: (state) => state.theme,
    skin: (state) => state.skin,
  },
  mutations: {
    setSidebarCollasp(state) {
      state.sidebarCollasp = !state.sidebarCollasp;
    },

    toogleDark(state) {
      state.isDark = !state.isDark;
      state.theme = state.theme === "dark" ? "light" : "dark";
      document.body.classList.toggle(state.theme);
      localStorage.setItem("theme", state.theme);
    },

    toggleSettings(state) {
      state.isOpenSettings = !state.isOpenSettings;
    },
    toggleMsidebar(state) {
      state.mobielSidebar = !state.mobielSidebar;
    },
    toggleSemiDark(state) {
      state.semidark = !state.semidark;
      state.semiDarkTheme = state.semidark ? "semi-dark" : "semi-light";
      document.body.classList.toggle(state.semiDarkTheme);
      localStorage.setItem("semiDark", state.semidark);
    },
  },
  actions: {
    // toogleDark
    toogleDark({ commit }) {
      commit("toogleDark");
    },
    // toggleSettings
    toggleSettings({ commit }) {
      commit("toggleSettings");
    },
    // setSidebarCollasp
    setSidebarCollasp({ commit }) {
      commit("setSidebarCollasp");
    },
    // toggleMsidebar
    toggleMsidebar({ commit }) {
      commit("toggleMsidebar");
    },
    toggleSemiDark({ commit }) {
      commit("toggleSemiDark");
    },

    // setTheme
  },
  modules: {
    apptodo,
    project,
    kanban,
    email,
    chat,
  },
});

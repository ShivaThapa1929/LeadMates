import { v4 as uuidv4 } from "uuid";
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  state: {
    addModal: false,
    editModal: false,
    todoSearch: "",
    eidtModalId: null,
    mobileTodoSidebar: false,
    isLoading: null,
    isSkeleton: true,
    trashTodo: [],

    // editobject
    editItem: {},
    todos: [
      {
        id: uuidv4(),
        image: [
          {
            image: require("@/assets/images/avatar/av-1.svg"),
            title: "Mahedi Amin",
          },
          {
            image: require("@/assets/images/avatar/av-2.svg"),
            title: "Sovo Haldar",
          },
          {
            image: require("@/assets/images/avatar/av-2.svg"),
            title: "Rakibul Islam",
          },
        ],
        title:
          "laboriosam mollitia et enim quasi adipisci quia provident illum",
        isDone: false,
        isfav: false,
        catagory: [
          {
            value: "team",
            label: "team",
          },
        ],
      },
      {
        id: uuidv4(),
        image: [
          {
            image: require("@/assets/images/avatar/av-2.svg"),
            title: "Rakibul Islam",
          },
        ],
        title:
          "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
        isDone: true,
        isfav: true,
        catagory: [
          {
            value: "low",
            label: "low",
          },
        ],
      },
      {
        id: uuidv4(),
        image: [
          {
            image: require("@/assets/images/avatar/av-2.svg"),
            title: "Sovo Haldar",
          },
          {
            image: require("@/assets/images/avatar/av-2.svg"),
            title: "Rakibul Islam",
          },
        ],
        title:
          "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
        isDone: true,
        isfav: true,
        catagory: [
          {
            value: "medium",
            label: "medium",
          },
          {
            value: "low",
            label: "low",
          },
        ],
      },
      {
        id: uuidv4(),
        image: [
          {
            image: require("@/assets/images/avatar/av-1.svg"),
            title: "Mahedi Amin",
          },
          {
            image: require("@/assets/images/avatar/av-2.svg"),
            title: "Sovo Haldar",
          },
          {
            image: require("@/assets/images/avatar/av-2.svg"),
            title: "Rakibul Islam",
          },
        ],
        title: "illo expedita consequatur quia in",
        isDone: false,
        isfav: false,
        catagory: [
          {
            value: "high",
            label: "high",
          },
          {
            value: "low",
            label: "low",
          },
        ],
      },
      {
        id: uuidv4(),
        image: [
          {
            image: require("@/assets/images/avatar/av-2.svg"),
            title: "Rakibul Islam",
          },
        ],
        title: "illo expedita consequatur quia in",
        isDone: false,
        isfav: false,
        catagory: [
          {
            value: "update",
            label: "update",
          },
        ],
      },
    ],
  },
  getters: {
    // isLoading
    isLoading: (state) => state.isLoading,
    todoSearch: (state) => state.todoSearch,
    todos: (state) =>
      state.todoSearch === ""
        ? state.todos
        : state.todos.filter((item) => {
            return item.title
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(state.todoSearch.toLowerCase().replace(/\s+/g, ""));
          }),

    // trashTodo
    trashTodo: (state) =>
      state.todoSearch === ""
        ? state.trashTodo
        : state.trashTodo.filter((item) => {
            return item.title
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(state.todoSearch.toLowerCase().replace(/\s+/g, ""));
          }),
    // isDone with search
    isDone: (state) =>
      state.todoSearch === ""
        ? state.todos.filter((item) => item.isDone === true)
        : state.todos
            .filter((item) => item.isDone === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.todoSearch.toLowerCase().replace(/\s+/g, ""));
            }),
    //isFav with search
    isFav: (state) =>
      state.todoSearch === ""
        ? state.todos.filter((item) => item.isfav === true)
        : state.todos
            .filter((item) => item.isfav === true)
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.todoSearch.toLowerCase().replace(/\s+/g, ""));
            }),
    //high with search
    high: (state) =>
      state.todoSearch === ""
        ? state.todos.filter((item) => item.catagory[0].value === "high")
        : state.todos
            .filter((item) => item.catagory[0].value === "high")
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.todoSearch.toLowerCase().replace(/\s+/g, ""));
            }),
    //medium with search
    medium: (state) =>
      state.todoSearch === ""
        ? state.todos.filter((item) => item.catagory[0].value === "medium")
        : state.todos
            .filter((item) => item.catagory[0].value === "medium")
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.todoSearch.toLowerCase().replace(/\s+/g, ""));
            }),
    //low with search
    low: (state) =>
      state.todoSearch === ""
        ? state.todos.filter((item) => item.catagory[0].value === "low")
        : state.todos
            .filter((item) => item.catagory[0].value === "low")
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.todoSearch.toLowerCase().replace(/\s+/g, ""));
            }),
    //team with search
    team: (state) =>
      state.todoSearch === ""
        ? state.todos.filter((item) => item.catagory[0].value === "team")
        : state.todos
            .filter((item) => item.catagory[0].value === "team")
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.todoSearch.toLowerCase().replace(/\s+/g, ""));
            }),
    //update with search
    update: (state) =>
      state.todoSearch === ""
        ? state.todos.filter((item) => item.catagory[0].value === "update")
        : state.todos
            .filter((item) => item.catagory[0].value === "update")
            .filter((item) => {
              return item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(state.todoSearch.toLowerCase().replace(/\s+/g, ""));
            }),
  },
  mutations: {
    // open todo
    OPEN_TODO(state) {
      state.addModal = true;
    },
    CLOSE_TODO(state) {
      state.addModal = false;
    },
    OPEN_EDIT_MODAL(state, itemId) {
      state.editModal = true;
      state.eidtModalId = itemId;
      //console.log(itemId); // find data id
    },
    CLOSE_EDIT_MODAL(state) {
      state.editModal = false;
    },
    GET_TODO(state, todo) {
      state.todo = todo;
    },
    ADD_TODO(state, data) {
      // add data into array by unshift

      // add data after 2 sec delay and set loading to false
      state.isLoading = true;
      state.mobileTodoSidebar = false;
      setTimeout(() => {
        state.todos.unshift(data);
        state.isLoading = false;
        toast.success -
          500("Task added", {
            timeout: 2000,
          });
      }, 1500);

      state.addModal = false;
    },
    EDIT_TODO(state, todo) {
      // if state editModal false make true
      state.todos.findIndex((item) => {
        if (item.id === todo.id) {
          state.editItem = item;
          state.editModal = !state.editModal;
          // find index
          let index = state.todos.indexOf(item);

          state.todos.splice(index, 1, {
            // give a id into eidtModalId

            id: todo.id,
            title: todo.title,
            isDone: todo.isDone,
            isfav: todo.isfav,
            image: todo.image,
            catagory: todo.catagory,
          });
        }
      });
      // console.log(todo, "to theke patahano");
    },
    REMOVE_TODO(state, todo) {
      var todos = state.todos;
      todos.splice(todos.indexOf(todo), 1);
      state.trashTodo.unshift(todo);
      toast.error("Task Delete", {
        timeout: 2000,
      });
    },
    COMPLETE_TODO(state, todo) {
      todo.completed = !todo.completed;
    },
    CLEAR_TODO(state) {
      state.todo = "";
    },
    // sorting
    SORT_AZ(state) {
      state.todos.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    },
    SORT_ZA(state) {
      state.todos.sort((a, b) => {
        return b.title.localeCompare(a.title);
      });
    },
    // RESET_SORT
    RESET_SORT(state) {
      state.todos.sort((a, b) => {
        return a.id.localeCompare(b.id);
      });
    },
    openMobileTodoSidebar(state) {
      state.mobileTodoSidebar = true;
    },
    closeMobileTodoSidebar(state) {
      state.mobileTodoSidebar = false;
    },
  },
  actions: {
    // open action
    openTodo({ commit }) {
      commit("OPEN_TODO");
    },
    openEditModal({ commit }, itemId) {
      commit("OPEN_EDIT_MODAL", itemId);
    },
    closeEditModal({ commit }) {
      commit("CLOSE_EDIT_MODAL");
    },
    closeTodo({ commit }) {
      commit("CLOSE_TODO");
    },

    getTodo({ commit }, todo) {
      commit("GET_TODO", todo);
    },
    addTodo({ commit }, data) {
      commit("ADD_TODO", data);
    },
    editTodo({ commit }, todo) {
      commit("EDIT_TODO", todo);
    },
    removeTodo({ commit }, todo) {
      commit("REMOVE_TODO", todo);
    },
    completeTodo({ commit }, todo) {
      commit("COMPLETE_TODO", todo);
    },
    clearTodo({ commit }) {
      commit("CLEAR_TODO");
    },
    // sort array
    sortAZ({ commit }) {
      commit("SORT_AZ");
    },

    sortZA({ commit }) {
      commit("SORT_ZA");
    },

    resetSort({ commit }) {
      commit("RESET_SORT");
    },
    openMobileTodoSidebar({ commit }) {
      commit("openMobileTodoSidebar");
    },
    closeMobileTodoSidebar({ commit }) {
      commit("closeMobileTodoSidebar");
    },
  },
};

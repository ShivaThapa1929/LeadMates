import { v4 as uuidv4 } from "uuid";
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  state: {
    columModal: false,
    taskModal: false,
    isLoading: null,
    openTaskId: null,

    // for edit
    editModal: false,
    editName: "",
    editassignto: null,
    editStartDate: null,
    editEndDate: null,
    editcta: null,
    editId: null,
    editdesc: null,
    columns: [
      {
        id: uuidv4(),
        name: "To Do",
        color: "#4669FA",
        tasks: [
          {
            id: uuidv4(),
            assignto: [
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
            name: "CRM Dashboard ",
            des: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
            startDate: "2022-10-03",
            endDate: "2022-10-06",
            progress: 75,
            category: [
              {
                value: "team",
                label: "team",
              },
              {
                value: "low",
                label: "low",
              },
            ],
          },
          {
            id: uuidv4(),
            assignto: [
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
            name: "Dashcode Example Kanban",
            des: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
            startDate: "2022-10-03",
            endDate: "2022-10-06",
            progress: 75,
            category: [
              {
                value: "team",
                label: "team",
              },
              {
                value: "low",
                label: "low",
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "In Progress",
        color: "#FA916B",
        tasks: [
          {
            id: uuidv4(),
            assignto: [
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
            name: "Business Dashboard ",
            des: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
            startDate: "2022-10-03",
            endDate: "2022-10-06",
            progress: 75,
            category: [
              {
                value: "team",
                label: "team",
              },
              {
                value: "low",
                label: "low",
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Done",
        color: "#50C793",
        tasks: [
          {
            id: uuidv4(),
            assignto: [
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
            name: "Management Dashboard ",
            des: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
            startDate: "2022-10-03",
            endDate: "2022-10-06",
            progress: 75,
            category: [
              {
                value: "team",
                label: "team",
              },
              {
                value: "low",
                label: "low",
              },
            ],
          },
        ],
      },
    ],
  },
  getters: {
    columns: (state) => state.columns,
    tasks: (state) => state.tasks,
  },
  mutations: {
    // add column
    addColumn(state, data) {
      state.isLoading = true;
      setTimeout(() => {
        state.columns.unshift(data);
        state.isLoading = false;
        toast.success -
          500("Column added", {
            timeout: 2000,
          });
      }, 1500);
      state.columModal = false;
    },
    // delete column
    delateColumn(state, data) {
      state.columns = state.columns.filter((item) => item.id !== data);

      toast.error("Column deleted", {
        timeout: 2000,
      });
    },

    // openColumn
    openColumn(state) {
      state.columModal = true;
    },

    // open task
    openTask(state, data) {
      state.columns.find((item) => {
        if (item.id === data.id) {
          state.taskModal = true;
          state.openTaskId = data.id;
        }
      });
    },
    // addTask by id
    addTask(state, data) {
      // sstore data in openid task
      state.columns.find((item) => {
        if (item.id === state.openTaskId) {
          item.tasks.unshift(data);
          state.taskModal = false;
        }
      });
    },
    removeTask(state, data) {
      state.columns.find((item) => {
        // item.tasks = item.tasks.filter((inc) => inc.id !== data.id);
        item.tasks.map((innerItem) => {
          if (innerItem.id === data.id) {
            // find index
            const index = item.tasks.indexOf(innerItem);
            // remove item
            item.tasks.splice(index, 1);
            // toas notification
            toast.error("Task deleted", {
              timeout: 2000,
            });
          }
        });
      });
    },
    // update task
    updateTask(state, data) {
      state.columns.find((item) => {
        item.tasks.findIndex((innerItem) => {
          if (innerItem.id === data.id) {
            // store data
            state.editId = data.id;
            state.editName = data.name;
            state.editassignto = data.assignto;
            state.editStartDate = data.startDate;
            state.editEndDate = data.endDate;
            state.editcta = data.category;
            state.editdesc = data.des;
            state.editModal = !state.editModal;

            // set data to data
            innerItem.name = data.name;
            innerItem.des = data.des;
            innerItem.startDate = data.startDate;
            innerItem.endDate = data.endDate;
            innerItem.assignto = data.assignto;
            innerItem.progress = data.progress;
            innerItem.category = data.category;
          }
        });
      });
    },
  },
  actions: {
    // add new column
    addColumn({ commit }, data) {
      commit("addColumn", data);
    },
    // delate column
    delateColumn({ commit }, data) {
      commit("delateColumn", data);
    },

    // open column modal
    openColumn({ commit }) {
      commit("openColumn");
    },

    // open task modal
    openTask({ commit }, id) {
      commit("openTask", id);
    },
    // addTask
    addTask({ commit }, data) {
      commit("addTask", data);
    },
    // remove task
    removeTask({ commit }, data) {
      commit("removeTask", data);
    },
    // update task
    updateTask({ commit }, data) {
      commit("updateTask", data);
    },
  },
};

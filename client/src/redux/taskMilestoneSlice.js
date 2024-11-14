import { createSlice } from "@reduxjs/toolkit";

const taskMilestoneSlice = createSlice({
  name: "taskMilestone",
  initialState: {
    tasks: [],
    milestones: [],
    selectedTask: null,
    selectedMilestone: null,
    loading: false,
    error: null,
    taskFilters: {
      assignee: "all",
      status: "all",
      milestone: "all",
    },
  },
  reducers: {
    // Task reducers
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task._id === action.payload._id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },

    // Milestone reducers
    setMilestones: (state, action) => {
      state.milestones = action.payload;
    },
    addMilestone: (state, action) => {
      state.milestones.push(action.payload);
    },
    updateMilestone: (state, action) => {
      const index = state.milestones.findIndex(
        (milestone) => milestone._id === action.payload._id
      );
      if (index !== -1) {
        state.milestones[index] = action.payload;
      }
    },
    deleteMilestone: (state, action) => {
      state.milestones = state.milestones.filter(
        (milestone) => milestone._id !== action.payload
      );
    },
    setSelectedMilestone: (state, action) => {
      state.selectedMilestone = action.payload;
    },

    // Loading and error states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Filter states
    setTaskFilters: (state, action) => {
      state.taskFilters = { ...state.taskFilters, ...action.payload };
    },

    // Update task status and order within columns
    updateTasksOrder: (state, action) => {
      const { source, destination, taskId } = action.payload;
      const task = state.tasks.find((t) => t._id === taskId);

      if (task) {
        task.status = destination.droppableId;
        // Update order if needed
        const newTasks = [...state.tasks];
        const sourceIndex = state.tasks.findIndex((t) => t._id === taskId);
        newTasks.splice(sourceIndex, 1);
        newTasks.splice(destination.index, 0, task);
        state.tasks = newTasks;
      }
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  setMilestones,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  setSelectedMilestone,
  setLoading,
  setError,
  setTaskFilters,
  updateTasksOrder,
} = taskMilestoneSlice.actions;

export default taskMilestoneSlice.reducer;

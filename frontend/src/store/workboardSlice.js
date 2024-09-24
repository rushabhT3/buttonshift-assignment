// src/store/workboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";

export const fetchWorkBoards = createAsyncThunk(
  "workboard/fetchWorkBoards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/workboards/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createWorkBoard = createAsyncThunk(
  "workboard/createWorkBoard",
  async ({ name, description, tasks }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/workboards/`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const newBoard = response.data;

      // Create tasks for the new board
      for (const task of tasks) {
        await axios.post(
          `${BACKEND_URL}/api/workboards/${newBoard.id}/add_task/`,
          task,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }

      return newBoard;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTask = createAsyncThunk(
  "workboard/addTask",
  async ({ boardId, task }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/workboards/${boardId}/add_task/`,
        task,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return { boardId, task: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  "workboard/updateTask",
  async ({ boardId, task }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/workboards/${boardId}/update_task/`,
        task,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return { boardId, task: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const workboardSlice = createSlice({
  name: "workboard",
  initialState: {
    workBoards: [],
    selectedBoard: null,
    status: "idle",
    error: null,
  },
  reducers: {
    selectBoard: (state, action) => {
      state.selectedBoard = action.payload;
    },
    deselectBoard: (state) => {
      state.selectedBoard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkBoards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.workBoards = action.payload;
      })
      .addCase(fetchWorkBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createWorkBoard.fulfilled, (state, action) => {
        state.workBoards.push(action.payload);
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const { boardId, task } = action.payload;
        const board = state.workBoards.find((b) => b.id === boardId);
        if (board) {
          board.tasks.push(task);
        }
        if (state.selectedBoard && state.selectedBoard.id === boardId) {
          state.selectedBoard.tasks.push(task);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { boardId, task } = action.payload;
        const board = state.workBoards.find((b) => b.id === boardId);
        if (board) {
          const taskIndex = board.tasks.findIndex((t) => t.id === task.id);
          if (taskIndex !== -1) {
            board.tasks[taskIndex] = task;
          }
        }
        if (state.selectedBoard && state.selectedBoard.id === boardId) {
          const taskIndex = state.selectedBoard.tasks.findIndex(
            (t) => t.id === task.id
          );
          if (taskIndex !== -1) {
            state.selectedBoard.tasks[taskIndex] = task;
          }
        }
      });
  },
});

export const { selectBoard, deselectBoard } = workboardSlice.actions;

export default workboardSlice.reducer;

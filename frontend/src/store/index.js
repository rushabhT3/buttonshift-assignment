// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import workboardReducer from "./workboardSlice";

export const store = configureStore({
  reducer: {
    workboard: workboardReducer,
  },
});

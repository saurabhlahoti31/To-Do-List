import { createSlice } from "@reduxjs/toolkit";

const themSlice = createSlice({
  name: "them",
  initialState: {
    them: "light",
  },
  reducers: {
    toggleThem: (state) => {
      state.them = state.them === "light" ? "dark" : "light";
    },
  },
});

export const { toggleThem } = themSlice.actions;
export default themSlice.reducer;
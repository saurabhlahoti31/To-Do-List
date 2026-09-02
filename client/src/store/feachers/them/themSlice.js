import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch (e) {
    return 'light';
  }
};

const themSlice = createSlice({
  name: "them",
  initialState: {
    them: getInitialTheme(),
  },
  reducers: {
    toggleThem: (state) => {
      state.them = state.them === "light" ? "dark" : "light";
      try {
        localStorage.setItem('theme', state.them);
      } catch (e) {}
    },
  },
});

export const { toggleThem } = themSlice.actions;
export default themSlice.reducer;
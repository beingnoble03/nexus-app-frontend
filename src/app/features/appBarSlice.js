import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "Login",
  isSearchVisible: false,
};

const appBarSlice = createSlice({
  name: "appBar",
  initialState,
  reducers: {
    titleChanged: (state, action) => {
      state.title = action.payload;
    },
    searchVisibilityToggled: (state, action) => {
      state.isSearchVisible = action.payload;
    },
  },
  extraReducers: {},
});

export default appBarSlice.reducer;
export const { titleChanged, searchVisibilityToggled } = appBarSlice.actions;

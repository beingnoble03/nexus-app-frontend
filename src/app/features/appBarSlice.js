import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "Login",
};

const appBarSlice = createSlice({
  name: "appBar",
  initialState,
  reducers: {
    titleChanged: (state, action) => {
      state.title = action.payload;
    },
  },
  extraReducers: {},
});

export default appBarSlice.reducer
export const { titleChanged } = appBarSlice.actions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const userId = localStorage.getItem("userId")
  ? localStorage.getItem("userId")
  : null;

const userName = localStorage.getItem("userName")
  ? localStorage.getItem("userName")
  : null;

const userToken = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const initialState = {
  loading: false,
  userId,
  userName,
  userToken,
  error: null,
};


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authenticated: (state, action) => {
      state.userToken = action.payload;
    },
    infoStored: (state, action) => {
      state.userName = action.payload["userName"]
      state.userId = action.payload["userId"]
    }
  },
  extraReducers:{
  },
});

export default userSlice.reducer;
export const { authenticated } = userSlice.actions;

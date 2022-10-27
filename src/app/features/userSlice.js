import { createSlice } from "@reduxjs/toolkit";
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
  isMaster: false,
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
    },
    isMasterChanged: (state, action) => {
      state.isMaster = action.payload
    }
  },
  extraReducers:{
  },
});

export default userSlice.reducer;
export const { authenticated, isMasterChanged } = userSlice.actions;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  drawerVisible: false,
  roundsVisible: false,
  selectedSeasonId: null,
  rounds: [],
  loading: false,
  error: null,
};

export const fetchRounds = createAsyncThunk("drawer/fecthRounds", () => {
  return axios({
    method: "get",
    url: `http://localhost:8000/api/roundDetails/`,
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
  }).then((response) => response.data);
});

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    toggled: (state) => {
      if (state.drawerVisible) {
        state.drawerVisible = false;
      } else {
        state.drawerVisible = true;
      }
    },
    roundsVisibilityChanged: (state, action) => {
      state.roundsVisible = action.payload;
    },
    roundsChanged: (state, action) => {
      state.rounds = action.payload;
    },
    selectedSeasonIdChanged: (state, action) => {
      state.selectedSeasonId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRounds.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRounds.fulfilled, (state, action) => {
      state.loading = false;
      const filteredRounds = action.payload.filter(
        (round) => round.season == state.selectedSeasonId
      );
      state.rounds = filteredRounds;
    });
    builder.addCase(fetchRounds.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default drawerSlice.reducer;
export const {
  toggled,
  roundsVisibilityChanged,
  roundsChanged,
  selectedSeasonIdChanged,
} = drawerSlice.actions;

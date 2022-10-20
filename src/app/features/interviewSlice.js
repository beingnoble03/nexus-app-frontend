import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  editModal: false,
  selectedInterview: null,
  loading: false,
  error: "",
  filterCompleted: false,
  filterPending: false,
  filterMinTimeAssigned: "",
  filterMaxTimeAssigned: "",
  filterMinTimeEntered: "",
  filterMaxTimeEntered: "",
  numOfFiltersApplied: 0,
};

export const updateSelectedInterview = createAsyncThunk(
  "interview/update",
  (data) => {
    return axios({
      method: "patch",
      url: `http://localhost:8000/api/interviews/${data.id}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data,
    }).then((response) => {
      console.log(response.data);
      return response.data;
    });
  }
);

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    editModalToggled: (state, action) => {
      state.editModal = action.payload;
    },
    selectedInterviewChanged: (state, action) => {
      state.selectedInterview = action.payload;
    },
    filterCompletedToggled: (state, action) => {
      state.filterCompleted = action.payload;
      if (action.payload) {
        state.numOfFiltersApplied++;
      } else {
        state.numOfFiltersApplied--;
      }
    },
    filterPendingToggled: (state, action) => {
      state.filterPending = action.payload;
      if (action.payload) {
        state.numOfFiltersApplied++;
      } else {
        state.numOfFiltersApplied--;
      }
    },
    filterMinTimeEnteredChanged: (state, action) => {
        let prevState = state.filterMinTimeEntered
      state.filterMinTimeEntered = action.payload;
      if (action.payload) {
          if(!prevState){
            state.numOfFiltersApplied++;
          }
      } else {      if(prevState){
        state.numOfFiltersApplied--;
      }
      }
    },
    filterMaxTimeEnteredChanged: (state, action) => {
        let prevState = state.filterMaxTimeEntered
      state.filterMaxTimeEntered = action.payload;
      if (action.payload) {
        if(!prevState){
          state.numOfFiltersApplied++;
        }
    } else {      if(prevState){
      state.numOfFiltersApplied--;
    }
    }
    },
    filterMinTimeAssignedChanged: (state, action) => {
      let prevState = state.filterMinTimeAssigned
      state.filterMinTimeAssigned = action.payload;
      if (action.payload) {
        if(!prevState){
          state.numOfFiltersApplied++;
        }
    } else {
      if(prevState){
        state.numOfFiltersApplied--;
      }
    }
    },
    filterMaxTimeAssignedChanged: (state, action) => {
        let prevState = state.filterMaxTimeAssigned
      state.filterMaxTimeAssigned = action.payload;
      if (action.payload) {
        if(!prevState){
          state.numOfFiltersApplied++;
        }
    } else {      if(prevState){
      state.numOfFiltersApplied--;
    }
    }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateSelectedInterview.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSelectedInterview.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedInterview = action.payload;
    });
    builder.addCase(updateSelectedInterview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default interviewSlice.reducer;
export const {
  editModalToggled,
  selectedInterviewChanged,
  filterCompletedToggled,
  filterPendingToggled,
  filterMaxTimeEnteredChanged,
  filterMinTimeEnteredChanged,
  filterMinTimeAssignedChanged,
  filterMaxTimeAssignedChanged,
} = interviewSlice.actions;

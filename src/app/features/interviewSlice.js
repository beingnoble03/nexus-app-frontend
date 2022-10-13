import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    editModal: false,
    selectedInterview: null,
    loading: false,
    error: '',
}

export const updateSelectedInterview = createAsyncThunk('interview/update', (data) => {
    return axios({
        method: "patch",
        url: `http://localhost:8000/api/interviews/${data.id}/`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        data,
      }).then((response) => {
          console.log(response.data)
          return response.data
    });
})

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        editModalToggled: (state, action) => {
            state.editModal = action.payload
        },
        selectedInterviewChanged: (state, action) => {
            state.selectedInterview = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateSelectedInterview.pending, (state) => {
            state.loading = true
        })
        builder.addCase(updateSelectedInterview.fulfilled, (state, action) => {
            state.loading = false
            state.selectedInterview = action.payload
        })
        builder.addCase(updateSelectedInterview.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    }
})

export default interviewSlice.reducer
export const { editModalToggled, selectedInterviewChanged } = interviewSlice.actions
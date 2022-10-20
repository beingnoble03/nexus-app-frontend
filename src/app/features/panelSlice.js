import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    panels: null,
    loading: false,
    error: "",
}

export const fetchPanels = createAsyncThunk("panel/fetchPanels", () => {
    return axios({
      method: "get",
      url: `http://localhost:8000/api/panels/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
        console.log(response.data)
        return response.data
    });
  });

const panelSlice = createSlice({
    name: 'panel',
    initialState,
    reducers: {
      panelsChanged: (state, action) => {
        state.panels = action.payload
      }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPanels.pending, (state) => {
          state.loading = true;
        });
        builder.addCase(fetchPanels.fulfilled, (state, action) => {
          state.loading = false;
          state.panels = action.payload;
        });
        builder.addCase(fetchPanels.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
})

export default panelSlice.reducer
export const { panelsChanged } = panelSlice.actions
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numOfFiltersApplied: 0,
  filterEvaluated: false,
  filterNotEvaluated: false,
  filterMinMarks: null,
  filterMaxMarks: null,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    filterEvaluatedToggled: (state, action) => {
      state.filterEvaluated = action.payload;
      if (action.payload) {
        state.numOfFiltersApplied++;
      } else {
        state.numOfFiltersApplied--;
      }
    },
    filterNotEvaluatedToggled: (state, action) => {
      state.filterNotEvaluated = action.payload;
      if (action.payload) {
        state.numOfFiltersApplied++;
      } else {
        state.numOfFiltersApplied--;
      }
    },
    filterMinMarksChanged: (state, action) => {
      const prevState = state.filterMinMarks;
      if (prevState === null && action.payload !== null) {
        state.numOfFiltersApplied++;
      } else if (prevState !== null && action.payload === null){
        state.numOfFiltersApplied--;
      }
      state.filterMinMarks = action.payload;
    },
    filterMaxMarksChanged: (state, action) => {
      const prevState = state.filterMaxMarks;
      if (prevState === null && action.payload !== null) {
        state.numOfFiltersApplied++;
      } else if (prevState !== null && action.payload === null){
        state.numOfFiltersApplied--;
      }
      state.filterMaxMarks = action.payload;
    },
  },
  extraReducers: {},
});

export default testSlice.reducer;
export const { filterEvaluatedToggled, filterNotEvaluatedToggled, filterMinMarksChanged, filterMaxMarksChanged } =
  testSlice.actions;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedRound: null
}

const seasonSlice = createSlice({
    name: "season",
    initialState,
    reducers: {
        selectedRoundChanged: (state, action) => {
            state.selectedRound = action.payload
        },
    },
    extraReducers: {},
})

export default seasonSlice.reducer
export const { selectedRoundChanged } = seasonSlice.actions
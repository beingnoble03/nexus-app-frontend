import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchParams: "",
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        searchParamsChanged: (state, action) => {
            state.searchParams = action.payload
        },
    },
    extraReducers: {},
})

export default searchSlice.reducer
export const { searchParamsChanged } = searchSlice.actions
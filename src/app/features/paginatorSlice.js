import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    numOfPages: 1,
    currentPage: 1,
}

const paginatorSlice = createSlice({
    name: "testTable",
    initialState,
    reducers: {
        currentPageChanged: (state, action) => {
            state.currentPage = action.payload
        },
        numOfPagesChanged: (state, action) => {
            state.numOfPages = action.payload
        },
    },
    extraReducers: {}
})

export default paginatorSlice.reducer
export const { currentPageChanged, numOfPagesChanged } = paginatorSlice.actions
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    drawerVisible: false,
    roundsVisible: false,
    selectedSeasonId: null,
    rounds: [],
}

const drawerSlice = createSlice({
    name: "drawer",
    initialState,
    reducers: {
        toggled: state => {
            if (state.drawerVisible) {
                state.drawerVisible = false
            } else {
                state.drawerVisible = true
            }
        },
        roundsVisibilityChanged : (state, action) => {
            state.roundsVisible = action.payload
        },
        roundsChanged: (state, action) => {
            state.rounds = action.payload
        },
        selectedSeasonIdChanged: (state, action) => {
            state.selectedSeasonId = action.payload
        }
    },
    extraReducers: {
    },
})

export default drawerSlice.reducer
export const { toggled, roundsVisibilityChanged, roundsChanged, selectedSeasonIdChanged } = drawerSlice.actions
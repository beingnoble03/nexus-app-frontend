import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    imgMembers: null,
}

const imgMemberSlice = createSlice({
    name: 'imgMember',
    initialState,
    reducers: {
        fetchedImgMembers: (state, action) => {
            state.imgMembers = action.payload
        }
    }
})

export default imgMemberSlice.reducer
export const { fetchedImgMembers } = imgMemberSlice.actions
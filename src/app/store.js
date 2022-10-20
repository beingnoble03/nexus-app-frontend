import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import drawerReducer from './features/drawerSlice'
import appBarReducer from './features/appBarSlice'
import seasonReducer from './features/seasonSlice'
import imgMemberReducer from './features/imgMemberSlice'
import panelReducer from './features/panelSlice'
import interviewReducer from './features/interviewSlice'
import paginatorReducer from './features/paginatorSlice'
import searchReducer from './features/searchSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        drawer: drawerReducer,
        appBar: appBarReducer,
        season: seasonReducer,
        imgMember: imgMemberReducer,
        panel: panelReducer,
        interview: interviewReducer,
        paginator: paginatorReducer,
        search: searchReducer,
    },
})

export default store
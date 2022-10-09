import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import drawerReducer from './features/drawerSlice'
import appBarReducer from './features/appBarSlice'
import seasonReducer from './features/seasonSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        drawer: drawerReducer,
        appBar: appBarReducer,
        season: seasonReducer,
    },
})

export default store
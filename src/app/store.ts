import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import authSlice from "../features/auth/authSlice"
import  tweetSlice  from "../features/Tweets/tweetSlice"



export const store = configureStore({
  reducer: {
    auth:authSlice,
    tweet:tweetSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>


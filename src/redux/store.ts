import { configureStore } from "@reduxjs/toolkit";
import communitySlice from "./reducers/communityReducer";

export const store = configureStore({
  reducer: {
    community: communitySlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

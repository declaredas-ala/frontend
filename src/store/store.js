import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userApiSlice from "./userApiSlice";

const store = configureStore({
  reducer: {
    userApi: userApiSlice,
    auth: authReducer,
  },

  devTools: true, // Enable Redux DevTools only in non-production environment
});

export default store;

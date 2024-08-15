import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import noteReducer from './noteSlice';
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        user: userReducer,
        notes: noteReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
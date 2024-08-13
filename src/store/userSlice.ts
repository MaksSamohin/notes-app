import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string | null;
  email: string | null;
}

const initialState: UserState = {
  uid: null,
  email: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ uid: string; email: string }>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

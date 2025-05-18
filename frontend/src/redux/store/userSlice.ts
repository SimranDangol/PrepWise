import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  fullName: string;
  email: string;
  image: string;
  isVerified: boolean;
}

const initialState: UserState = {
  id: "",
  fullName: "",
  email: "",
  image: "",
  isVerified: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

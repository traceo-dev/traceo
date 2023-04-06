import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@traceo/types";

interface State {
  user: IUser;
  isLoading: boolean;
}

const initialState = {
  user: {} as IUser,
  isLoading: false
};

const slice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    beginUserFetch: (state): State => ({ ...state, isLoading: true }),
    setUser: (state, action: PayloadAction<IUser>): State => {
      return { ...state, isLoading: false, user: action.payload };
    }
  }
});

export const { setUser, beginUserFetch } = slice.actions;
export const reducer = slice.reducer;

export default {
  adminUser: reducer
};

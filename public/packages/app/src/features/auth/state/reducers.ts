import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@traceo/types";

export interface UserState {
  user: IUser;
  isFetching: boolean;
}

const initialState = {
  user: {} as IUser,
  isFetching: false
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    userLoaded: (state, action: PayloadAction<IUser>): UserState => ({ ...state, user: action.payload })
  }
});

export const { userLoaded } = userSlice.actions;
export const userReducer = userSlice.reducer;

export default {
  user: userReducer
};

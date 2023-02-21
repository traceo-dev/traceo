import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@traceo/types";

export interface UserState {
  user: IUser;
  isFetched: boolean;
}

const initialState = {
  user: {} as IUser,
  isFetched: false
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    userLoaded: (state, action: PayloadAction<IUser>): UserState => ({
      ...state,
      user: action.payload,
      isFetched: true
    })
  }
});

export const { userLoaded } = userSlice.actions;
export const userReducer = userSlice.reducer;

export default {
  user: userReducer
};

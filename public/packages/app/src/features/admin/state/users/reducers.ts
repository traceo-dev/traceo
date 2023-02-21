import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@traceo/types";

export interface UsersState {
  users: IUser[];
  user: IUser;
  hasFetched: boolean;
}

const initialState = {
  users: [],
  user: {} as IUser,
  hasFetched: false
};

const userSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    usersLoaded: (state, action: PayloadAction<IUser[]>): UsersState => {
      return { ...state, hasFetched: true, users: action.payload };
    },
    userLoaded: (state, action: PayloadAction<IUser>): UsersState => {
      return { ...state, hasFetched: true, user: action.payload };
    },
    userFetchedAction: (state, action: PayloadAction<boolean>): UsersState => {
      return {
        ...state,
        hasFetched: action.payload
      };
    }
  }
});

export const { usersLoaded, userLoaded, userFetchedAction } = userSlice.actions;
export const userReducer = userSlice.reducer;

export default {
  users: userReducer
};

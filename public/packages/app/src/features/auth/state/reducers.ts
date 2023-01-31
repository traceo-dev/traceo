import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAccount } from "@traceo/types";

export interface UserState {
  account: IAccount;
  isFetching: boolean;
}

const initialState = {
  account: {} as IAccount,
  isFetching: false
};

const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    accountLoaded: (state, action: PayloadAction<IAccount>): UserState => ({ ...state, account: action.payload })
  }
});

export const { accountLoaded } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;

export default {
  account: accountReducer
};

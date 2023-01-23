import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "../../../types/accounts";

export interface UserState {
  account: Account;
  isFetching: boolean;
}

const initialState = {
  account: {} as Account,
  isFetching: false
};

const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    accountLoaded: (state, action: PayloadAction<Account>): UserState => ({ ...state, account: action.payload })
  }
});

export const { accountLoaded } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;

export default {
  account: accountReducer
};

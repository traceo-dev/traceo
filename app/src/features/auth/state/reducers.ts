import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "../../../types/accounts";
import { loginAccount } from "./actions";

export interface UserState {
  account: Account;
  isSuccess: boolean;
  isError: boolean;
  isFetching: boolean;
}

const initialState = {
  account: {} as Account,
  isSuccess: false,
  isError: false,
  isFetching: false
};

const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
    accountLoaded: (state, action: PayloadAction<Account>): UserState => {
      return { ...state, account: action.payload };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginAccount.fulfilled, (state) => {
      state.isFetching = false;
      state.isSuccess = true;
    }),
      builder.addCase(loginAccount.pending, (state) => {
        state.isFetching = true;
      }),
      builder.addCase(loginAccount.rejected, (state) => {
        state.isFetching = false;
        state.isSuccess = false;
        state.isError = true;
      });
  }
});

export const { clearState, accountLoaded } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;

export default {
  account: accountReducer
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "../../../../types/accounts";

export interface AccountsState {
  accounts: Account[];
  account: Account;
  hasFetched: boolean;
}

const initialState = {
  accounts: [],
  account: {} as Account,
  hasFetched: false
};

const accountsSlice = createSlice({
  name: "serverAccounts",
  initialState: initialState,
  reducers: {
    serverAccountsLoaded: (state, action: PayloadAction<Account[]>): AccountsState => {
      return { ...state, hasFetched: true, accounts: action.payload };
    },
    serverAccountLoaded: (state, action: PayloadAction<Account>): AccountsState => {
      return { ...state, hasFetched: true, account: action.payload };
    },
    serverAccountLoadedAction: (state, action: PayloadAction<boolean>): AccountsState => {
      return {
        ...state,
        hasFetched: action.payload
      }
    }
  }
});

export const { serverAccountsLoaded, serverAccountLoaded, serverAccountLoadedAction } = accountsSlice.actions;
export const accountsReducer = accountsSlice.reducer;

export default {
  serverAccounts: accountsReducer
};

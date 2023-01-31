import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAccount } from "@traceo/types";

export interface AccountsState {
  accounts: IAccount[];
  account: IAccount;
  hasFetched: boolean;
}

const initialState = {
  accounts: [],
  account: {} as IAccount,
  hasFetched: false
};

const accountsSlice = createSlice({
  name: "serverAccounts",
  initialState: initialState,
  reducers: {
    serverAccountsLoaded: (state, action: PayloadAction<IAccount[]>): AccountsState => {
      return { ...state, hasFetched: true, accounts: action.payload };
    },
    serverAccountLoaded: (state, action: PayloadAction<IAccount>): AccountsState => {
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

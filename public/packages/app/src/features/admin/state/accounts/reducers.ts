import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@traceo/types";

export interface AccountsState {
  accounts: IUser[];
  account: IUser;
  hasFetched: boolean;
}

const initialState = {
  accounts: [],
  account: {} as IUser,
  hasFetched: false
};

const accountsSlice = createSlice({
  name: "serverAccounts",
  initialState: initialState,
  reducers: {
    serverAccountsLoaded: (state, action: PayloadAction<IUser[]>): AccountsState => {
      return { ...state, hasFetched: true, accounts: action.payload };
    },
    serveruserLoaded: (state, action: PayloadAction<IUser>): AccountsState => {
      return { ...state, hasFetched: true, account: action.payload };
    },
    serveruserLoadedAction: (state, action: PayloadAction<boolean>): AccountsState => {
      return {
        ...state,
        hasFetched: action.payload
      }
    }
  }
});

export const { serverAccountsLoaded, serveruserLoaded, serveruserLoadedAction } = accountsSlice.actions;
export const accountsReducer = accountsSlice.reducer;

export default {
  serverAccounts: accountsReducer
};

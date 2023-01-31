import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "@traceo/types";

export interface AccountsState {
  applications: Application[];
  application: Application;
  hasFetched: boolean;
}

const initialState = {
  applications: [],
  application: {} as Application,
  hasFetched: false
};

const applicationsSlice = createSlice({
  name: "serverApplications",
  initialState: initialState,
  reducers: {
    serverApplicationsLoaded: (
      state,
      action: PayloadAction<Application[]>
    ): AccountsState => ({ ...state, hasFetched: true, applications: action.payload }),
    serverApplicationLoaded: (
      state,
      action: PayloadAction<Application>
    ): AccountsState => ({ ...state, hasFetched: true, application: action.payload }),
    serverAppLoadedAction: (state, action: PayloadAction<boolean>): AccountsState => ({
      ...state,
      hasFetched: action.payload
    }),
  }
});

export const { serverApplicationsLoaded, serverApplicationLoaded, serverAppLoadedAction } =
  applicationsSlice.actions;
export const accountsReducer = applicationsSlice.reducer;

export default {
  serverApplications: accountsReducer
};

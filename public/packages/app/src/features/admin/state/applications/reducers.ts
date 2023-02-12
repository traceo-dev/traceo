import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IApplication } from "@traceo/types";

export interface UsersState {
  applications: IApplication[];
  application: IApplication;
  hasFetched: boolean;
}

const initialState = {
  applications: [],
  application: {} as IApplication,
  hasFetched: false
};

const applicationsSlice = createSlice({
  name: "usersApps",
  initialState: initialState,
  reducers: {
    serverApplicationsLoaded: (
      state,
      action: PayloadAction<IApplication[]>
    ): UsersState => ({ ...state, hasFetched: true, applications: action.payload }),
    serverApplicationLoaded: (
      state,
      action: PayloadAction<IApplication>
    ): UsersState => ({ ...state, hasFetched: true, application: action.payload }),
    serverAppLoadedAction: (state, action: PayloadAction<boolean>): UsersState => ({
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
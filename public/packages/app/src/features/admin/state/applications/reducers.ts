import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IApplication } from "@traceo/types";

export interface UsersState {
  applications: IApplication[];
  hasFetched: boolean;
}

const initialState = {
  applications: [],
  hasFetched: false
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState: initialState,
  reducers: {
    applicationsLoaded: (
      state,
      action: PayloadAction<IApplication[]>
    ): UsersState => ({ ...state, hasFetched: true, applications: action.payload }),

  }
});

export const { applicationsLoaded } = applicationsSlice.actions;
export const accountsReducer = applicationsSlice.reducer;

export default {
  serverApplications: accountsReducer
};

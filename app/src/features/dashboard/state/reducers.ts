import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountApplication } from "src/types/application";

export interface ApplicationsState {
  applications: AccountApplication[];
  starredApplications: AccountApplication[];
  hasFetched: boolean;
  hasStarredFetched: boolean;
}

const initialState = {
  applications: [],
  starredApplications: [],
  hasFetched: false,
  hasStarredFetched: false
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState: initialState,
  reducers: {
    applicationsLoaded: (
      state,
      action: PayloadAction<AccountApplication[]>
    ): ApplicationsState => {
      return { ...state, hasFetched: true, applications: action.payload };
    }
  }
});

export const { applicationsLoaded } = applicationsSlice.actions;
export const applicationReducer = applicationsSlice.reducer;

export default {
  applications: applicationReducer
};

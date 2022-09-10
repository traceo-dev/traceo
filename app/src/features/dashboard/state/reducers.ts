import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationMember } from "src/types/application";

export interface ApplicationsState {
  applications: ApplicationMember[];
  starredApplications: ApplicationMember[];
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
      action: PayloadAction<ApplicationMember[]>
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

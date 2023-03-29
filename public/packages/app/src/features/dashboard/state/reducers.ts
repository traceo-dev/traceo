import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MemberProject } from "@traceo/types";

export interface ApplicationsState {
  projects: MemberProject[];
  hasFetched: boolean;
}

const initialState = {
  projects: [],
  hasFetched: false
};

const applicationsSlice = createSlice({
  name: "projects",
  initialState: initialState,
  reducers: {
    projectsLoaded: (
      state,
      action: PayloadAction<MemberProject[]>
    ): ApplicationsState => ({ ...state, hasFetched: true, projects: action.payload })
  }
});

export const { projectsLoaded } = applicationsSlice.actions;
export const applicationReducer = applicationsSlice.reducer;

export default {
  projects: applicationReducer
};

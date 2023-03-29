import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProject } from "@traceo/types";

export interface UsersState {
  projects: IProject[];
  hasFetched: boolean;
}

const initialState = {
  projects: [],
  hasFetched: false
};

const projectsSlice = createSlice({
  name: "projects",
  initialState: initialState,
  reducers: {
    projectsLoaded: (state, action: PayloadAction<IProject[]>): UsersState => ({
      ...state,
      hasFetched: true,
      projects: action.payload
    })
  }
});

export const { projectsLoaded } = projectsSlice.actions;
export const instanceApplications = projectsSlice.reducer;

export default {
  instanceApplications
};

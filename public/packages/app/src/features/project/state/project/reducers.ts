import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProject, MemberRole } from "@traceo/types";

export interface ProjectState {
  project: IProject;
  permission: MemberRole;
  hasFetched: boolean;
}

const initialState: ProjectState = {
  project: {} as IProject,
  permission: null,
  hasFetched: false
};

const projectSlice = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    projectLoaded: (state, action: PayloadAction<IProject>): ProjectState => ({
      ...state,
      project: action.payload
    }),
    projectPermission: (state, action: PayloadAction<MemberRole>): ProjectState => ({
      ...state,
      hasFetched: true,
      permission: action.payload
    }),
    resetProjectState: (): ProjectState => ({ ...initialState })
  }
});

export const { projectLoaded, projectPermission, resetProjectState } =
projectSlice.actions;
export const projectReducer = projectSlice.reducer;

export default {
  project: projectReducer
};

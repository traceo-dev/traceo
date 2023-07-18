import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dashboard, IProject, MemberRole } from "@traceo/types";

interface State {
  project: IProject;
  permission: MemberRole;
  dashboards: Dashboard[];
  isLoading: boolean;
}

const initialState: State = {
  project: {} as IProject,
  permission: undefined,
  dashboards: [],
  isLoading: false
};

const projectSlice = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    beginProjectFetch: (state): State => ({ ...state, isLoading: true }),
    endProjectFetch: (state): State => ({ ...state, isLoading: false }),
    setProject: (state, action: PayloadAction<IProject>): State => ({
      ...state,
      project: action.payload,
      isLoading: false
    }),
    setPermission: (state, action: PayloadAction<MemberRole>): State => ({
      ...state,
      permission: action.payload
    }),
    setDashboards: (state, action: PayloadAction<Dashboard[]>): State => ({
      ...state,
      dashboards: action.payload
    }),
    resetProjectState: (): State => ({ ...initialState })
  }
});

export const {
  setProject,
  setPermission,
  setDashboards,
  resetProjectState,
  beginProjectFetch,
  endProjectFetch
} = projectSlice.actions;
export const projectReducer = projectSlice.reducer;

export default {
  project: projectReducer
};

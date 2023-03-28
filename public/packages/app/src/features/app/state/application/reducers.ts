import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProject, MemberRole } from "@traceo/types";

export interface ApplicationState {
  application: IProject;
  permission: MemberRole;
  hasFetched: boolean;
}

const initialState: ApplicationState = {
  application: {} as IProject,
  permission: null,
  hasFetched: false
};

const applicationSlice = createSlice({
  name: "application",
  initialState: initialState,
  reducers: {
    applicationLoaded: (state, action: PayloadAction<IProject>): ApplicationState => ({
      ...state,
      application: action.payload
    }),
    applicationPermission: (state, action: PayloadAction<MemberRole>): ApplicationState => ({
      ...state,
      hasFetched: true,
      permission: action.payload
    }),
    resetApplicationState: (): ApplicationState => ({ ...initialState })
  }
});

export const { applicationLoaded, resetApplicationState, applicationPermission } =
  applicationSlice.actions;
export const applicationReducer = applicationSlice.reducer;

export default {
  application: applicationReducer
};

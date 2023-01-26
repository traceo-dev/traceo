import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application, MemberRole } from "../../../../types/application";

export interface ApplicationState {
  application: Application;
  permission: MemberRole;
  hasFetched: boolean;
}

const initialState: ApplicationState = {
  application: {} as Application,
  permission: null,
  hasFetched: false
};

const applicationSlice = createSlice({
  name: "application",
  initialState: initialState,
  reducers: {
    applicationLoaded: (state, action: PayloadAction<Application>): ApplicationState => ({ ...state, application: action.payload }),
    applicationPermission: (state, action: PayloadAction<MemberRole>): ApplicationState => ({ ...state, hasFetched: true, permission: action.payload }),
    resetApplicationState: (): ApplicationState => ({ ...initialState })
  }
});

export const {
  applicationLoaded,
  resetApplicationState,
  applicationPermission } = applicationSlice.actions;
export const applicationReducer = applicationSlice.reducer;

export default {
  application: applicationReducer
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IApplication, MemberRole } from "@traceo/types";

export interface ApplicationState {
  application: IApplication;
  permission: MemberRole;
  hasFetched: boolean;
}

const initialState: ApplicationState = {
  application: {} as IApplication,
  permission: null,
  hasFetched: false
};

const applicationSlice = createSlice({
  name: "application",
  initialState: initialState,
  reducers: {
    applicationLoaded: (state, action: PayloadAction<IApplication>): ApplicationState => ({
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

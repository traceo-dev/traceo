import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "../../../../types/application";

export interface ApplicationState {
  application: Application;
  hasFetched: boolean;
}

const initialState: ApplicationState = {
  application: {} as Application,
  hasFetched: false
};

const applicationSlice = createSlice({
  name: "application",
  initialState: initialState,
  reducers: {
    applicationLoaded: (state, action: PayloadAction<Application>): ApplicationState => ({ ...state, hasFetched: true, application: action.payload }),
  }
});

export const { applicationLoaded } = applicationSlice.actions;
export const applicationReducer = applicationSlice.reducer;

export default {
  application: applicationReducer
};

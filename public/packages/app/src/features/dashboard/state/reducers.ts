import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MemberApplication } from "@traceo/types";

export interface ApplicationsState {
  applications: MemberApplication[];
  hasFetched: boolean;
}

const initialState = {
  applications: [],
  hasFetched: false
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState: initialState,
  reducers: {
    applicationsLoaded: (
      state,
      action: PayloadAction<MemberApplication[]>
    ): ApplicationsState => ({ ...state, hasFetched: true, applications: action.payload })
  }
});

export const { applicationsLoaded } = applicationsSlice.actions;
export const applicationReducer = applicationsSlice.reducer;

export default {
  applications: applicationReducer
};

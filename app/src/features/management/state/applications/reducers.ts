import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "src/types/application";

export interface AccountsState {
    applications: Application[];
    application: Application;
    hasFetched: boolean;
}

const initialState = {
    applications: [],
    application: {} as Application,
    hasFetched: false
};

const applicationsSlice = createSlice({
    name: "applications",
    initialState: initialState,
    reducers: {
        serverApplicationsLoaded: (state, action: PayloadAction<Application[]>): AccountsState => {
            return { ...state, hasFetched: true, applications: action.payload };
        },
        serverApplicationLoaded: (state, action: PayloadAction<Application>): AccountsState => {
            return { ...state, hasFetched: true, application: action.payload };
        }
    }
});

export const { serverApplicationsLoaded, serverApplicationLoaded } = applicationsSlice.actions;
export const accountsReducer = applicationsSlice.reducer;

export default {
    serverApplications: accountsReducer
};

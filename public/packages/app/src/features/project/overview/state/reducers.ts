import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dashboard, IIncident } from "@traceo/types";

export interface State {
  dashboard: Dashboard;
  isLoading: boolean;
}

const initialState: State = {
  dashboard: {} as Dashboard,
  isLoading: false
};

const slice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    beginDashboardFetch: (state): State => ({ ...state, isLoading: true }),
    endDashboardFetch: (state): State => ({ ...state, isLoading: false }),
    setDashboard: (state, action: PayloadAction<Dashboard>): State => ({
      ...state,
      dashboard: action.payload
    })
  }
});

export const { setDashboard, beginDashboardFetch, endDashboardFetch } = slice.actions;
export const reducer = slice.reducer;

export default {
  dashboard: reducer
};

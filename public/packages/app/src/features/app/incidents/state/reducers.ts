import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IComment, IIncident } from "@traceo/types";

export interface IncidentsState {
  incidents: IIncident[];
  hasFetched: boolean;
}

const initialState = {
  incidents: [],
  hasFetched: false
};

const incidentsSlice = createSlice({
  name: "incidents",
  initialState: initialState,
  reducers: {
    incidentsLoaded: (state, action: PayloadAction<IIncident[]>): IncidentsState => ({
      ...state,
      hasFetched: true,
      incidents: action.payload
    }),
    resetIncidentsState: (): IncidentsState => ({ ...initialState })
  }
});

export const { incidentsLoaded, resetIncidentsState } = incidentsSlice.actions;
export const incidentsReducer = incidentsSlice.reducer;

export interface IncidentState {
  incident: IIncident;
  hasFetched: boolean;
  hasCommentsFetched: boolean;
  comments: IComment[];
}

const initialIncidentState: IncidentState = {
  incident: {} as IIncident,
  hasFetched: false,
  hasCommentsFetched: false,
  comments: [] as IComment[]
};

const incidentSlice = createSlice({
  name: "incident",
  initialState: initialIncidentState,
  reducers: {
    incidentLoaded: (state, action: PayloadAction<IIncident>): IncidentState => ({
      ...state,
      hasFetched: true,
      incident: action.payload
    }),
    incidentCommentsLoaded: (state, action: PayloadAction<IComment[]>): IncidentState => ({
      ...state,
      hasCommentsFetched: true,
      comments: action.payload
    }),
    resetIncidentState: (): IncidentState => ({ ...initialIncidentState })
  }
});

export const { incidentLoaded, incidentCommentsLoaded, resetIncidentState } =
  incidentSlice.actions;
export const incidentReducer = incidentSlice.reducer;

export default {
  incidents: incidentsReducer,
  incident: incidentReducer
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IComment, IEvent, IIncident } from "@traceo/types";
import { Action } from "history";

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
  hasEventsFetched: boolean;
  comments: IComment[];
  events: IEvent[];
}

const initialIncidentState: IncidentState = {
  incident: {} as IIncident,
  hasFetched: false,
  hasCommentsFetched: false,
  hasEventsFetched: false,
  comments: [] as IComment[],
  events: [] as IEvent[]
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
    incidentEventsLoaded: (state, action: PayloadAction<IEvent[]>): IncidentState => ({
      ...state,
      hasEventsFetched: true,
      events: action.payload
    }),
    resetIncidentState: (): IncidentState => ({ ...initialIncidentState })
  }
});

export const {
  incidentLoaded,
  incidentCommentsLoaded,
  resetIncidentState,
  incidentEventsLoaded
} = incidentSlice.actions;
export const incidentReducer = incidentSlice.reducer;

export default {
  incidents: incidentsReducer,
  incident: incidentReducer
};

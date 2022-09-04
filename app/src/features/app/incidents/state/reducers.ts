import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "src/types/comments";
import { Incident } from "src/types/incidents";

export interface IncidentsState {
  incidents: Incident[];
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
    incidentsLoaded: (state, action: PayloadAction<Incident[]>): IncidentsState => {
      return { ...state, hasFetched: true, incidents: action.payload };
    }
  }
});

export const { incidentsLoaded } = incidentsSlice.actions;
export const incidentsReducer = incidentsSlice.reducer;

export interface IncidentState {
  incident: Incident;
  hasFetched: boolean;
  hasCommentsFetched: boolean;
  comments: Comment[];
}

const initialIncidentState: IncidentState = {
  incident: {} as Incident,
  hasFetched: false,
  hasCommentsFetched: false,
  comments: [] as Comment[]
};

const incidentSlice = createSlice({
  name: "incident",
  initialState: initialIncidentState,
  reducers: {
    incidentLoaded: (state, action: PayloadAction<Incident>): IncidentState => {
      return { ...state, hasFetched: true, incident: action.payload };
    },
    incidentCommentsLoaded: (state, action: PayloadAction<Comment[]>): IncidentState => {
      return { ...state, hasCommentsFetched: true, comments: action.payload };
    }
  }
});

export const { incidentLoaded, incidentCommentsLoaded } = incidentSlice.actions;
export const incidentReducer = incidentSlice.reducer;

export default {
  incidents: incidentsReducer,
  incident: incidentReducer
};

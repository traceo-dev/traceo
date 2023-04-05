import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIncident } from "@traceo/types";

interface State {
    incidents: IIncident[];
    isLoading: boolean;
}

const initialState = {
    incidents: [],
    isLoading: false
};

const slice = createSlice({
    name: "incidents",
    initialState,
    reducers: {
        beginIncidentsFetch: (state) => ({ ...state, isLoading: true }),
        setIncidents: (state, action: PayloadAction<IIncident[]>): State => ({
            ...state, incidents: action.payload, isLoading: false
        }),
        resetIncidentsState: (): State => ({ ...initialState })
    }
});

export const { setIncidents, resetIncidentsState, beginIncidentsFetch } = slice.actions;
export const reducer = slice.reducer;
export default {
    incidents: reducer
};

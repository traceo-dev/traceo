import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIncident } from "@traceo/types";

export interface State {
    incident: IIncident;
    isLoading: boolean;
}

const initialState: State = {
    incident: {} as IIncident,
    isLoading: false
};

const slice = createSlice({
    name: "incident",
    initialState,
    reducers: {
        beginIncidentFetch: (state): State => ({ ...state, isLoading: true }),
        endIncidentFetch: (state): State => ({ ...state, isLoading: false }),
        setIncident: (state, action: PayloadAction<IIncident>): State => ({ ...state, incident: action.payload }),
        resetIncidentState: (): State => ({ ...initialState })
    }
});

export const {
    setIncident,
    resetIncidentState,
    beginIncidentFetch,
    endIncidentFetch
} = slice.actions;
export const reducer = slice.reducer;

export default {
    incident: reducer
};

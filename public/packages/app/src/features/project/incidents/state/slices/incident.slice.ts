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
        setIncident: (state, action: PayloadAction<IIncident>): State => ({
            ...state, incident: action.payload, isLoading: false
        }),
        resetIncidentState: (): State => ({ ...initialState })
    }
});

export const {
    setIncident,
    resetIncidentState,
    beginIncidentFetch,
} = slice.actions;
export const reducer = slice.reducer;

export default {
    incident: reducer
};

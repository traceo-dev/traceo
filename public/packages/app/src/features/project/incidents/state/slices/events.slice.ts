import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEvent } from "@traceo/types";

export interface State {
    events: IEvent[];
    isLoading: boolean;
}

const initialState: State = {
    events: [] as IEvent[],
    isLoading: false
};

const slice = createSlice({
    name: "events",
    initialState,
    reducers: {
        beginEventsFetch: (state): State => ({ ...state, isLoading: true }),
        setIncidentEvents: (state, action: PayloadAction<IEvent[]>): State => ({
            ...state, events: action.payload, isLoading: false
        }),
        resetEventsState: (): State => ({ ...initialState })
    }
});

export const { setIncidentEvents, beginEventsFetch, resetEventsState } = slice.actions;
export const eventsReducer = slice.reducer;

export default {
    events: eventsReducer
};

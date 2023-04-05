import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEvent, PlotData } from "@traceo/types";

export interface State {
    groupedEvents: PlotData[];
    isLoading: boolean;
}

const initialState: State = {
    groupedEvents: [] as PlotData[],
    isLoading: false
};

const slice = createSlice({
    name: "groupedEvents",
    initialState,
    reducers: {
        beginGroupedEventsFetch: (state): State => ({ ...state, isLoading: true }),
        setGroupedEvents: (state, action: PayloadAction<PlotData[]>): State => ({
            ...state, groupedEvents: action.payload, isLoading: false
        }),
        resetGroupedEvents: (): State => ({ ...initialState })
    }
});

export const { beginGroupedEventsFetch, setGroupedEvents, resetGroupedEvents } = slice.actions;
export const eventsReducer = slice.reducer;

export default {
    groupedEvents: eventsReducer
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMetric } from "types/metrics";

export interface MetricsState {
    metrics: IMetric[];
    hasFetched: boolean;
}

const initialState = {
    metrics: [],
    hasFetched: false
};

const incidentsSlice = createSlice({
    name: "metrics",
    initialState: initialState,
    reducers: {
        metricsLoaded: (state, action: PayloadAction<IMetric[]>): MetricsState => {
            return { ...state, hasFetched: true, metrics: action.payload };
        }
    }
});

export const { metricsLoaded } = incidentsSlice.actions;
export const metricsReducer = incidentsSlice.reducer;

export default {
    metrics: metricsReducer
};

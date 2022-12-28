import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMetric, MetricsResponse } from "types/metrics";

type MetricType = {
    config: IMetric,
    datasource: MetricsResponse[]
}

export interface MetricsState {
    metrics: IMetric[];
    metric: MetricType;
    hasFetched: boolean;
    hasFetchedMetric: boolean;
}

const initialState = {
    metrics: [],
    metric: {} as MetricType,
    hasFetched: false,
    hasFetchedMetric: false
};

const metricsSlice = createSlice({
    name: "metrics",
    initialState: initialState,
    reducers: {
        metricsLoaded: (state, action: PayloadAction<IMetric[]>): MetricsState => {
            return { ...state, hasFetched: true, metrics: action.payload, metric: null };
        },
        metricLoaded: (state, action: PayloadAction<MetricType>): MetricsState => {
            return {
                ...state, hasFetchedMetric: true, metric: {
                    datasource: action.payload.datasource,
                    config: action.payload.config
                }
            }
        }
    }
});

export const { metricsLoaded, metricLoaded } = metricsSlice.actions;
export const metricsReducer = metricsSlice.reducer;

export default {
    metrics: metricsReducer
};

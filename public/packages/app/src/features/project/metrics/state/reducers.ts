import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMetric, MetricResponseType } from "@traceo/types";

type MetricType = {
  options: IMetric;
  datasource: MetricResponseType;
};

export interface MetricsState {
  metrics: IMetric[];
  metric: MetricType;
  hasFetched: boolean;
  hasFetchedMetric: boolean;
}

const initialState = {
  metrics: [] as IMetric[],
  metric: {} as MetricType,
  hasFetched: false,
  hasFetchedMetric: false
};

const metricsSlice = createSlice({
  name: "metrics",
  initialState: initialState,
  reducers: {
    metricsLoaded: (state, action: PayloadAction<IMetric[]>): MetricsState => ({
      ...state,
      hasFetched: true,
      metrics: action.payload,
      metric: null
    }),
    metricLoaded: (state, action: PayloadAction<MetricType>): MetricsState => ({
      ...state,
      hasFetchedMetric: true,
      metric: { ...action.payload }
    })
  }
});

export const { metricsLoaded, metricLoaded } = metricsSlice.actions;
export const metricsReducer = metricsSlice.reducer;

export default {
  metrics: metricsReducer
};

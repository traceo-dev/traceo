import { ApiResponse, IMetric, MetricsResponse } from "@traceo/types";
import api from "../../../../core/lib/api";
import { ThunkResult } from "@store/types";
import { metricLoaded, metricsLoaded } from "./reducers";

type MetricsQuery = {
    search: string;
}
export const loadMetrics = (query?: MetricsQuery): ThunkResult<void> => {
    return async (dispatch, getStore) => {
        const application = getStore().application.application;
        if (!application) {
            return;
        }

        const { data } = await api.get<ApiResponse<IMetric[]>>(`/api/metrics/${application.id}`, query);
        dispatch(metricsLoaded(data));
    };
};

type MetricPreviewType = {
    options: IMetric,
    datasource: MetricsResponse[]
}

type LoadMetricType = {
    appId: string;
    metricId: string;
    from: number;
    to: number;
}
export const loadMetric = (payload: LoadMetricType): ThunkResult<void> => {
    return async (dispatch) => {
        console.log("payload: ", payload);
        if (!payload?.from || !payload?.to) {
            return;
        }

        const { data } = await api.get<ApiResponse<MetricPreviewType>>(`/api/metrics/${payload.appId}/preview/${payload.metricId}`, {
            from: payload.from,
            to: payload.to
        });
        dispatch(metricLoaded({ ...data }));
    }
}

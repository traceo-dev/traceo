import { ApiResponse } from "../../../../types/api";
import api from "../../../../core/lib/api";
import { ThunkResult } from "../../../../types/store";
import { IMetric, MetricsResponse } from "types/metrics";
import { metricLoaded, metricsLoaded } from "./reducers";

export const loadMetrics = (): ThunkResult<void> => {
    return async (dispatch, getStore) => {
        const application = getStore().application.application;
        if (!application) {
            return;
        }

        const { data } = await api.get<ApiResponse<IMetric[]>>(`/api/metrics/${application.id}`);
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
    hrCount: number;
}
export const loadMetric = (payload: LoadMetricType): ThunkResult<void> => {
    return async (dispatch) => {
        const { data } = await api.get<ApiResponse<MetricPreviewType>>(`/api/metrics/${payload.appId}/preview/${payload.metricId}`, {
            hrCount: payload.hrCount
        });
        dispatch(metricLoaded({ ...data }));
    }
}

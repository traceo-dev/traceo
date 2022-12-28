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
    config: IMetric,
    datasource: MetricsResponse[]
}

export const loadMetric = (appId: string, metricId: string): ThunkResult<void> => {
    return async (dispatch) => {
        const { data } = await api.get<ApiResponse<MetricPreviewType>>(`/api/metrics/${appId}/preview/${metricId}`);
        dispatch(metricLoaded({ ...data }));
    }
}

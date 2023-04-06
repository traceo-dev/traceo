import api from "../../../../core/lib/api";
import { metricLoaded, metricsLoaded } from "./reducers";
import { ThunkResult } from "@store/types";
import { ApiResponse, IMetric, MetricResponseType } from "@traceo/types";

type MetricsQuery = {
  search: string;
};
export const loadMetrics = (query?: MetricsQuery): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const project = getStore().project.project;
    const { data } = await api.get<ApiResponse<IMetric[]>>(`/api/metrics/${project.id}`, query);
    dispatch(metricsLoaded(data));
  };
};

type MetricPreviewType = {
  options: IMetric;
  datasource: MetricResponseType;
};

type LoadMetricType = {
  projectId: string;
  metricId: string;
  from: number;
  to: number;
};
export const loadMetric = (payload: LoadMetricType): ThunkResult<void> => {
  return async (dispatch) => {
    if (!payload?.from || !payload?.to) {
      return;
    }

    const { data } = await api.get<ApiResponse<MetricPreviewType>>(
      `/api/metrics/${payload.projectId}/preview/${payload.metricId}`,
      {
        from: payload.from,
        to: payload.to
      }
    );
    dispatch(metricLoaded({ ...data }));
  };
};

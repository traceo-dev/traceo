import { ApiResponse } from "../../../../types/api";
import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "../../../../types/store";
import { IMetric } from "types/metrics";
import { metricsLoaded } from "./reducers";

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

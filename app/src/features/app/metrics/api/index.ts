import api from "../../../../core/lib/api";
import { notify } from "../../../../core/utils/notify";
import { loadApplication } from "../../../../features/app/state/application/actions";
import { dispatch } from "../../../../store/store";
import { ApiResponse } from "../../../../types/api";
import { DataSourceConnStatus, CONNECTION_STATUS } from "../../../../types/tsdb";
import { loadMetrics } from "../state/actions";

const reload = async (
    id: string,
    setLoading?: (val: boolean) => void
) => {
    setLoading && setLoading(true);
    await api
        .get<ApiResponse<DataSourceConnStatus>>("/api/influx/connection/check", { id })
        .then((resp) => {
            const status = resp.data.status;
            if (status === CONNECTION_STATUS.CONNECTED) {
                dispatch(loadMetrics());
            }

            dispatch(loadApplication());
        })
        .finally(() => setLoading && setLoading(false));
};

export const metricsApi = {
    reload
}
import { store } from "../../../../store";
import api from "../../../../core/lib/api";
import { loadApplication } from "../../state/application/actions";
import { ApiResponse, DataSourceConnStatus, ConnectionStatus  } from "@traceo/types";
import { loadMetrics } from "../state/actions";

const reload = async (
    id: string,
    setLoading?: (val: boolean) => void
) => {
    setLoading && setLoading(true);
    await api
        .get<ApiResponse<DataSourceConnStatus>>("/api/datasource/connection/check", { id })
        .then((resp) => {
            const status = resp.data.status;
            if (status === ConnectionStatus.CONNECTED) {
                store.dispatch(loadMetrics());
            }

            store.dispatch(loadApplication());
        })
        .finally(() => setLoading && setLoading(false));
};

export const metricsApi = {
    reload
}
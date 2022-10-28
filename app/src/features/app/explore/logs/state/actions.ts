import api from "../../../../../core/lib/api";
import { TraceoLog } from "../../../../../types/logs";
import { ThunkResult } from "../../../../../types/store";
import { logsLoaded } from "./reducers";

interface DateProps {
    startDate: number;
    endDate: number;
}
export const loadApplicationLogs = (appId: string, props: DateProps): ThunkResult<void> => {
    return async (dispatch, getStore) => {
        const application = getStore().application.application;
        const currentEnv = localStorage.getItem("env") || application?.defaultEnv;

        if (!appId) {
            appId = application.id
        }

        const logs = await api.get<TraceoLog[]>("/api/application/logs", {
            id: appId,
            env: currentEnv,
            ...props
        });
        dispatch(logsLoaded(logs));
    };
};

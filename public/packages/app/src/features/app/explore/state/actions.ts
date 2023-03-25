import api from "../../../../core/lib/api";
import { logsLoaded, resetState } from "./reducers";
import { ThunkResult } from "@store/types";
import { ApiResponse, ILog } from "@traceo/types";

interface LogsProps {
  from: number;
  to: number;
  levels?: string[];
}
export const loadApplicationLogs = (appId: string, props: LogsProps): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    dispatch(resetState());

    const application = getStore().application.application;
    if (!appId) {
      appId = application.id;
    }

    const { data } = await api.get<ApiResponse<ILog[]>>("/api/application/logs", {
      id: appId,
      ...props
    });
    dispatch(logsLoaded(data));
  };
};

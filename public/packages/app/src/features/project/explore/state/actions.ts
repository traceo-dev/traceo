import api from "../../../../core/lib/api";
import { logsLoaded, resetState } from "./reducers";
import { ThunkResult } from "@store/types";
import { ApiResponse, ILog } from "@traceo/types";

interface LogsProps {
  from: number;
  to: number;
  levels?: string[];
}
export const loadApplicationLogs = (projectId: string, props: LogsProps): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    dispatch(resetState());

    const project = getStore().project.project;
    if (!projectId) {
      projectId = project.id;
    }

    const { data } = await api.get<ApiResponse<ILog[]>>("/api/project/logs", {
      id: projectId,
      ...props
    });
    dispatch(logsLoaded(data));
  };
};

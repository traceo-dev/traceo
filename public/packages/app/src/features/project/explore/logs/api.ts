import { ApiResponse, ILog, LogsQueryProps, UplotDataType } from "@traceo/types";
import api from "../../../../core/lib/api";

export const loadLogs = async (props: LogsQueryProps) => {
  return await api.get<ApiResponse<{ logs: ILog[] }>>("/api/logs", props);
};

export const loadGraph = async (props: LogsQueryProps) => {
  return await api.get<ApiResponse<{ graph: UplotDataType }>>("/api/logs/graph", props);
};

export const logsApi = {
  loadLogs,
  loadGraph
};

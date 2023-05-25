import { ApiResponse, ILog } from "@traceo/types";
import api from "../../../../core/lib/api";

export type LogsQueryProps = {
    projectId: string;
    from: number;
    to: number;
    take?: number;
}

export const loadLogs = async (props: LogsQueryProps) => {
    return await api.get<ApiResponse<{ logs: ILog[] }>>("/api/logs", props);
}

export const loadGraph = async (props: LogsQueryProps) => {
    return await api.get<ApiResponse<{ graph: [number, number][] }>>("/api/logs/graph", props);
}

export const logsApi = {
    loadLogs,
    loadGraph
}
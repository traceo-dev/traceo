import { ApiResponse, LogLevel, ILog } from "@traceo/types";
import api from "src/core/lib/api";

export type LogsQueryProps = {
    projectId: string;
    from: number;
    to: number;
    levels: LogLevel[];
    take?: number;
}

// type QueryResponseType<T> = {
//     onCallback: (response: T) => void;
//     onError: (error: Error) => void;
//     onEnd: () => void;
// }

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

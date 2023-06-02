import { ApiResponse } from "@traceo/types";
import api from "../../../../core/lib/api";
import { ExploreGraphProps, ExploreMetricsResponseType } from "./types";

const loadGraph = async (projectId: string, props: ExploreGraphProps) => {
    return await api.get<ApiResponse<ExploreMetricsResponseType>>(`/api/metrics/${projectId}/explore`, props);
}

const loadRawData = async (projectId: string, props: ExploreGraphProps) => {
    return await api.get<ApiResponse<[]>>(`/api/metrics/${projectId}/raw-data`, props);
}

export const metricsApi = {
    loadGraph,
    loadRawData
}

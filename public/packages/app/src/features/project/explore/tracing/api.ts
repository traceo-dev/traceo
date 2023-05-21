import { ApiResponse, Span } from "@traceo/types"
import api from "src/core/lib/api"

export type TraceQueryProps = {
    projectId: string,
    from: number,
    to: number,
    search: string,
    serviceName: string,
    spanName: string,
    traceStatus: string,
    traceKind: string,
    durationMin: number,
    durationMax: number,
    take: number
};

const loadTraces = async (props: TraceQueryProps) => {
    return await api.get<ApiResponse<Span[]>>("/api/tracing", props)
}

export const tracingApi = {
    loadTraces
}

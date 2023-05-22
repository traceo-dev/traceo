import { SpanKind, SpanStatusCode } from "@traceo/types";

export const mapStatusName: Record<SpanStatusCode, string> = {
    [SpanStatusCode.ERROR]: "Error",
    [SpanStatusCode.OK]: "OK",
    [SpanStatusCode.UNSET]: "Unset"
};

export const mapKindName: Record<SpanKind, string> = {
    [SpanKind.CLIENT]: "Client",
    [SpanKind.CONSUMER]: "Consumer",
    [SpanKind.INTERNAL]: "Internal",
    [SpanKind.PRODUCER]: "Producer",
    [SpanKind.SERVER]: "Server"
};

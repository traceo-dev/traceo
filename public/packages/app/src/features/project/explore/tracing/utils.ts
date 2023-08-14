import { Span, SpanKind, SpanStatusCode } from "@traceo/types";
import dayjs from "dayjs";

export const mapKindName: Record<SpanKind, string> = {
  [SpanKind.CLIENT]: "Client",
  [SpanKind.CONSUMER]: "Consumer",
  [SpanKind.INTERNAL]: "Internal",
  [SpanKind.PRODUCER]: "Producer",
  [SpanKind.SERVER]: "Server"
};

export const formatNs = (time: number, raw = false) => {
  return `${dayjs.unix(time).format("YYYY-MM-DD HH:mm:ss:SSS")} ${raw ? `(${time})` : ""}`;
};

export const prepareSpansToDownload = (spans: Span[]) => {
  for (const span of spans) {
    span.attributes = JSON.parse(span.attributes);
    span.events = JSON.parse(span.events);
  }

  return spans;
};

export const parseDuration = (duration: number) => {
  if (duration >= 1000) {
    const seconds = duration / 1000;

    if (seconds >= 60) {
      const minutes = seconds / 60;
      return `${minutes.toFixed(2)}min`;
    }

    return `${seconds.toFixed(2)}s`;
  }

  return `${duration.toFixed(2)}ms`;
};

import { Dictionary } from ".";

export type Span = {
  id: string;
  trace_id: string;
  span_id: string;

  status: string;
  status_message?: string;

  parent_span_id: string;
  service_name: string; //attributes["service.name"]
  name: string;
  start_time: number;
  end_time: number;
  duration: number;
  kind: number;

  // saved in clickhouse as String
  // main type: Attributes
  attributes: string;

  // saved in clickhouse as String
  // main type: TimedEvent
  events: string;

  receive_timestamp?: number;
  project_id: string;
};

/**
 * Structure representaing tree preview in span details.
 */
export type TreeSpan = Span & {
  childrens: TreeSpan[];
};

export type TraceoSpan = {
  name: string;
  kind: string;
  status: string;
  statusMessage: string;
  traceId: string;
  spanId: string;
  parentSpanId: string;
  serviceName: string;
  startEpochNanos: number;
  endEpochNanos: number;
  attributes: Dictionary<String>;
  events: TraceoSpanEvent[];
}

export type TraceoSpanEvent = {
  name: string;
  epochNanos: number;
  attributes: Dictionary<string>;
}

export enum TraceoSpanStatus {
  Unset,
  OK,
  Error
}

export enum TraceoSpanKind {
  INTERNAL,
  SERVER,
  PRODUCER,
  CONSUMER,
  CLIENT
}
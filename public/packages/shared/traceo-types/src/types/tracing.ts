export type Span = {
    id: string;
    trace_id: string;
    span_id: string;
    parent_span_id: string;
    service_name: string; //attributes["service.name"]
    name: string;
    start_time: number;
    end_time: number;
    duration: number;
    kind: number;

    // saved in clickhouse as String
    // main type: Attributes
    attributes: string,

    // saved in clickhouse as String
    // main type: TimedEvent
    events: string;

    receive_timestamp?: number;
    project_id: string;
}

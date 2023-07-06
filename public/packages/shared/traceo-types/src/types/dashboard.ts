import { METRIC_UNIT, IMetricSerie, PLOT_TYPE } from "./metrics";

export interface Dashboard {
    id: string;
    createdAt?: number;

    name: string;
    description: string;

    projectId?: string;
    panels: DashboardPanel[];

    // base dashboard created for project
    isBase: boolean;
    isEditable: boolean;
    isTimePicker: boolean;
}

export interface PanelGridPosition {
    x: number;
    y: number;
    h: number;
    w: number;
    i?: string;
}

export interface PanelConfiguration {
    unit: METRIC_UNIT | string;
    visualization: VISUALIZATION_TYPE;
    series: IMetricSerie[];
    histogram?: {
        bucket: {
            size: number;
            offset: number;
        },
        min: number;
        max: number;
    }
    stack?: {
        show: boolean;
        strategy: string
    }
    line?: {
        marker?: {
            show?: boolean;
            shape?: string; //MARKER_SHAPE
        };
    };
    tooltip: {
        show: boolean;
        position: string;
    };
    legend: {
        show: boolean;
        orient: string;
    };
    axis: {
        showX?: boolean;
        showY?: boolean;
        showGridLines?: boolean;
    },
}

export enum VISUALIZATION_TYPE {
    TIME_SERIES = "time_series",
    HISTOGRAM = "histogram",
    GAUGE = "gauge",
    // TABLE = "table"
};

export interface DashboardPanel {
    id?: string;
    createdAt?: number;

    title: string;
    description: string;

    type: DASHBOARD_PANEL_TYPE;

    // position for react-grid-layout
    gridPosition: PanelGridPosition;

    // panel configuration
    config: PanelConfiguration;

    dashboard?: Dashboard;
}

export type DASHBOARD_PANEL_TYPE =
    | "todays_events"
    | "overview_events"
    | "recent_events"
    | "last_event_at"
    | "today_events_count"
    | "logs_plot"
    | "logs_table"
    | "custom";

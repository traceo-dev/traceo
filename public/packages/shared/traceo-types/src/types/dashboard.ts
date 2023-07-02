import { METRIC_UNIT, IMetricSerie } from "./metrics";

export interface Dashboard {
    id: string;
    createdAt?: number;
    name: string;
    projectId?: string;
    panels: DashboardPanel[];

    // base dashboard created for project
    isBase: boolean;
    isEditable: boolean;
}

export interface PanelGridPosition {
    x: number;
    y: number;
    h: number;
    w: number;
    i: string;
}

export interface PanelConfiguration {
    unit: METRIC_UNIT | string;
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

export enum PANEL_TYPE {
    TIME_SERIES = "time_series",
    HISTOGRAM = "histogram",
    GAUGE = "gauge",
    TABLE = "table",
    TODAY_EVENTS_PLOT = "today_events_plot",
    TODAY_EVENTS_COUNTER = "today_events_counter",
    TODAY_EVENTS_LAST_TIME = "today_events_last_time",
    EVENTS_OVERVIEW = "events_overview"
};

export interface DashboardPanel {
    id?: string;
    createdAt?: number;

    title: string;
    description: string;
    type: PANEL_TYPE;

    // position for react-grid-layout
    gridPosition: PanelGridPosition;

    // panel configuration
    config: PanelConfiguration;

    dashboard: Dashboard;
}

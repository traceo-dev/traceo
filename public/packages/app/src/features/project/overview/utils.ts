import { DeepPartial, DASHBOARD_PANEL_TYPE, DashboardPanel, METRIC_UNIT, PanelConfiguration, VISUALIZATION_TYPE } from "@traceo/types";
import { randomHexColor } from "../../../core/utils/colors";

export const GRID_BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
export const GRID_MARGIN = [8, 8];
export const GRID_COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
export const GRID_ROW_HEIGHT = 30;
export const GRID_PADDING = [0, 0];
export const GRID_BASE_PANEL_HEIGHT = 103;

const panelConfig: PanelConfiguration = {
    legend: {
        show: false,
        orient: "horizontal"
    },
    line: {
        marker: {
            show: false
        }
    },
    tooltip: {
        show: true,
        position: ""
    },
    axis: {
        showX: true,
        showY: true,
        showGridLines: true
    },
    stack: {
        show: false,
        strategy: undefined
    },
    histogram: {
        bucket: {
            size: 5,
            offset: 0
        },
        min: 1,
        max: undefined
    },
    unit: METRIC_UNIT.NONE,
    visualization: VISUALIZATION_TYPE.TIME_SERIES,
    series: []
}

export const initialCustomPanelProps: DashboardPanel = {
    title: "Panel title",
    description: "Panel description",
    type: "custom",
    gridPosition: {
        w: 10,
        h: 8,
        x: 0,
        y: 0,
    },
    config: {
        ...panelConfig,
        visualization: VISUALIZATION_TYPE.TIME_SERIES,
        series: [
            {
                name: "New serie",
                description: undefined,
                config: {
                    area: {
                        opacity: 50,
                        show: false
                    },
                    barWidth: 50,
                    color: randomHexColor(),
                    lineWidth: 1,
                    type: "line"
                },
                field: undefined,
                unit: METRIC_UNIT.NONE,
            }
        ],
    }
};

export const dashboardPanelOptions: Record<DASHBOARD_PANEL_TYPE, DeepPartial<DashboardPanel>> = {
    custom: initialCustomPanelProps,
    todays_events: {
        title: "Today's events",
        type: "todays_events",
        gridPosition: {
            w: 10,
            h: 8,
            x: 0,
            y: 0
        },
        config: {
            ...panelConfig,
            visualization: VISUALIZATION_TYPE.TIME_SERIES,
            series: [
                {
                    config: {
                        area: {
                            opacity: 100,
                            show: true
                        },
                        barWidth: 90,
                        color: "#3B82F5",
                        lineWidth: 1,
                        type: "bar"
                    },
                    name: "Events",
                    description: undefined,
                    field: "events_overview_plot",
                    unit: METRIC_UNIT.NONE
                }
            ],
        }
    },
    overview_events: {
        title: "Overview events",
        type: "overview_events",
        gridPosition: {
            w: 12,
            h: 10,
            x: 0,
            y: 0
        },
        config: {
            ...panelConfig,
            visualization: VISUALIZATION_TYPE.TIME_SERIES,
            series: [
                {
                    config: {
                        area: {
                            opacity: 100,
                            show: true
                        },
                        barWidth: 90,
                        color: "#3B82F5",
                        lineWidth: 1,
                        type: "bar"
                    },
                    name: "Events",
                    description: undefined,
                    field: "events_overview_plot",
                    unit: METRIC_UNIT.NONE
                }
            ],
        }
    },
    recent_events: undefined,
    last_event_at: undefined,
    today_events_count: undefined,
    logs_plot: undefined,
    logs_table: undefined,
}

export const validate = (options: DashboardPanel) => {
    const errors = [];

    if (!options.title) {
        errors.push("Metric name is required.");
    }

    const series = options.config.series;
    if (series.length === 0) {
        errors.push("You have to add at least one serie to this metric.");
    }

    const missingName = series.find((serie) => !serie?.name);
    if (missingName) {
        errors.push("Your metric serie does not have a required name value.");
    }

    const missingField = series.find((serie) => !serie?.field);
    if (missingField) {
        errors.push("Your metric serie does not have a required field value.");
    }

    return errors;
};

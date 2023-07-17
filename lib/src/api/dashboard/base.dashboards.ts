import { PanelConfiguration, METRIC_UNIT, VISUALIZATION_TYPE, DashboardPanel } from "@traceo/types";

const basePanelConfigs: PanelConfiguration = {
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
        showGridLines: true,
        showFloatLabels: false
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
    series: [],
    text: {
        size: 0,
        weight: 0,
        color: "",
        value: ""
    }
};

export const initialDashboardPanels: DashboardPanel[] = [
    {
        title: "Today's events",
        type: "todays_events",
        description: undefined,
        gridPosition: {
            w: 20,
            h: 8,
            x: 0,
            y: 0
        },
        config: {
            ...basePanelConfigs,
            visualization: VISUALIZATION_TYPE.TIME_SERIES,
            series: [
                {
                    config: {
                        area: {
                            opacity: 100,
                            show: true
                        },
                        barWidth: 90,
                        color: "#9a2e19",
                        lineWidth: 1,
                        type: "bar"
                    },
                    name: "Events",
                    description: undefined,
                    field: "events_overview_plot",
                    unit: METRIC_UNIT.NONE
                }
            ]
        }
    },
    {
        title: "Last month events",
        type: "overview_events",
        description: undefined,
        gridPosition: {
            w: 24,
            h: 10,
            x: 0,
            y: 8
        },
        config: {
            ...basePanelConfigs,
            visualization: VISUALIZATION_TYPE.TIME_SERIES,
            series: [
                {
                    config: {
                        area: {
                            opacity: 50,
                            show: true
                        },
                        barWidth: 90,
                        color: "#9a2e19",
                        lineWidth: 1,
                        type: "bar"
                    },
                    name: "Events",
                    description: undefined,
                    field: "events_overview_plot",
                    unit: METRIC_UNIT.NONE
                }
            ]
        }
    },
    {
        title: "Last seen",
        description: "Time of today's last event.",
        type: "last_event_at",
        gridPosition: {
            w: 4,
            h: 4,
            x: 20,
            y: 4
        },
        config: {
            ...basePanelConfigs,
            text: {
                weight: 500,
                size: 32,
                color: "#ccccdc"
            },
            visualization: VISUALIZATION_TYPE.STAT
        }
    },
    {
        title: "Events count",
        description: "Number of events captured since midnight.",
        type: "today_events_count",
        gridPosition: {
            w: 4,
            h: 4,
            x: 20,
            y: 0
        },
        config: {
            ...basePanelConfigs,
            text: {
                weight: 500,
                size: 44,
                color: "#ccccdc"
            },
            visualization: VISUALIZATION_TYPE.STAT
        }
    }
];

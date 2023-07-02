import { DashboardPanel, PANEL_TYPE, METRIC_UNIT } from "@traceo/types";
import { DeepPartial } from "redux";
import { randomHexColor } from "src/core/utils/colors";

export const initialPanelProps: DeepPartial<DashboardPanel> = {
    title: "New panel",
    description: "New panel description",
    type: PANEL_TYPE.TIME_SERIES,
    gridPosition: {
        w: 10,
        h: 8,
        x: 0,
        y: 0
    },
    config: {
        series: [
            {
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
                name: "New serie",
                description: undefined,
                field: undefined,
                unit: METRIC_UNIT.NONE,
                show: true
            }
        ],
        histogram: {
            bucket: {
                size: 5,
                offset: 0
            },
            min: 1,
            max: undefined
        },
        stack: {
            show: false,
            strategy: "samesign"
        },
        legend: {
            show: true,
            orient: "horizontal"
        },
        line: {
            marker: {
                show: false
            }
        },
        tooltip: {
            show: false
        },
        axis: {
            showX: true,
            showY: true,
            showGridLines: true
        },
        unit: METRIC_UNIT.NONE
    }
};

import { DashboardPanel, METRIC_UNIT, VISUALIZATION_TYPE } from "@traceo/types";
import { DeepPartial } from "redux";
import { randomHexColor } from "src/core/utils/colors";

export const GRID_BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
export const GRID_MARGIN = [8, 8];
export const GRID_COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
export const GRID_ROW_HEIGHT = 30;
export const GRID_PADDING = [0, 0];
export const GRID_BASE_PANEL_HEIGHT = 103;

export const initialCustomPanelProps: DeepPartial<DashboardPanel> = {
    title: "Panel title",
    description: "Panel description",
    type: "custom",
    gridPosition: {
        w: 10,
        h: 8,
        x: 0,
        y: 0
    },
    config: {
        visualization: VISUALIZATION_TYPE.TIME_SERIES,
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

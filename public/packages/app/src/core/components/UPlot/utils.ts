import { EXPLORE_PLOT_TYPE, PLOT_TYPE } from "@traceo/types";
import dayjs from "dayjs";
import { isFloat } from "src/core/utils/numbers";

const omitFloatLabels = (_self: uPlot,
    splits: number[],
    _axisIdx: number,
    _foundSpace: number,
    _foundIncr: number) => {
    return splits.map((val) => {
        if (isFloat(val)) {
            return "";
        }

        return val;
    });
}

const measureTextWidth = (text: string): number => {
    const ctx = document.createElement("canvas").getContext("2d");
    //   https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText
    const metrics = ctx.measureText(text);
    return metrics.width;
}

export const getTimeAxisSpace = (
    self: uPlot,
    axisIdx: number,
    scaleMin: number,
    _scaleMax: number,
    _plotDim: number
): number => {
    const scale = self.scales[self.axes[axisIdx].scale!];
    const isTimeScale = scale.time;

    if (isTimeScale) {
        const axisLabel = timeFormatter(self, [scaleMin], undefined, undefined, undefined);
        const baseTextWidth = axisLabel[0] + 15;

        const width = measureTextWidth(baseTextWidth);
        return width;
    }

    return 50;
}

export const timeFormatter = (
    self: uPlot,
    splits: number[],
    _axisIdx: number,
    _foundSpace: number,
    _foundIncr: number
): string[] => {
    let format = "MMM";

    const axisData = self.data[0];
    const dataSize = self.data[0].length;

    const start = dayjs.unix(axisData[0]);
    const end = dayjs.unix(axisData[dataSize - 1]);

    const diffInMinutes = end.diff(start, "minutes") + 1;

    if (diffInMinutes === 1) {
        format = "HH:mm:ss:SSS";
    } else if (diffInMinutes <= 5) {
        format = "HH:mm:ss";
    } else if (diffInMinutes <= 60 * 24) {
        format = "HH:mm";
    } else if (diffInMinutes <= 60 * 24 * 28) {
        format = "DD/MM";
    } else if (diffInMinutes <= 60 * 24 * 28 * 12) {
        format = "MMM DD";
    }

    return splits.map((v) => {
        if (!v) {
            return "";
        }

        return dayjs.unix(v).format(format);
    });
};


export const mapToUplotType: Record<EXPLORE_PLOT_TYPE, PLOT_TYPE> = {
    bar: PLOT_TYPE.BAR,
    area: PLOT_TYPE.LINE,
    line: PLOT_TYPE.LINE,
    points: PLOT_TYPE.POINTS
};

export const getFillOpacity = (type: string) => {
    if (type === "area") {
        return 40;
    }

    if (type === "bar") {
        return 100;
    }

    return 0;
};

export const uPlotUtils = {
    getTimeAxisSpace,
    timeFormatter,
    omitFloatLabels
}

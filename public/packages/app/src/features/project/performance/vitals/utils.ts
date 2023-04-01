import { VitalsBinType, VitalsEnum, Performance } from "@traceo/types";
import { VITALS_THRESHOLD, Range, ThresholdRange, VitalsHealthType } from "./types";

export enum HEALTH_COLOR {
    GOOD = "#0CCE6B",
    NEED_IMPROVEMENT = "#FFA400",
    POOR = "#FF4E42"
}

export const healthColor: Record<VitalsHealthType, HEALTH_COLOR> = {
    good: HEALTH_COLOR.GOOD,
    need_improvement: HEALTH_COLOR.NEED_IMPROVEMENT,
    poor: HEALTH_COLOR.POOR
}

// 0.300000000004 -> 0.3
// 0.79999999999999 -> 0.8
export const round = (val: number): number => {
    return Math.round(val * 10) / 10;
};

export const vitalsFormatter = (field: VitalsEnum, value: number) => {
    if (field === VitalsEnum.CLS) {
        return Number(value).toFixed(2);
    }

    // Format values in miliseconds
    if (value < 1000) {
        return `${round(value)} ms`;
    }

    // Parse miliseconds to seconds
    return `${round(value) / 1000} s`;
};

export const barColor = (field: VitalsEnum, value: number) => {
    switch (field) {
        case VitalsEnum.LCP: {
            if (value >= 0 && value <= 2500) {
                return HEALTH_COLOR.GOOD;
            }

            if (value >= 2500 && value <= 4000) {
                return HEALTH_COLOR.NEED_IMPROVEMENT;
            }

            return HEALTH_COLOR.POOR;
        }
        case VitalsEnum.FID: {
            if (value >= 0 && value <= 100) {
                return HEALTH_COLOR.GOOD;
            }

            if (value > 100 && value <= 300) {
                return HEALTH_COLOR.NEED_IMPROVEMENT;
            }

            return HEALTH_COLOR.POOR;
        }
        case VitalsEnum.CLS: {
            if (value >= 0 && value <= 0.1) {
                return HEALTH_COLOR.GOOD;
            }

            if (value > 0.1 && value <= 0.25) {
                return HEALTH_COLOR.NEED_IMPROVEMENT;
            }

            return HEALTH_COLOR.POOR;
        }
        case VitalsEnum.FP:
        case VitalsEnum.FCP: {
            if (value >= 0 && value <= 1000) {
                return HEALTH_COLOR.GOOD;
            }

            if (value > 1000 && value <= 3000) {
                return HEALTH_COLOR.NEED_IMPROVEMENT;
            }

            return HEALTH_COLOR.POOR;
        }
        default:
            return HEALTH_COLOR.GOOD;
    }
}

export const calculateVitalsAvg = (field: VitalsEnum, data: VitalsBinType[]): string => {
    if (!data || data.length === 0) {
        return "-"
    }

    const totalCount = data.reduce((acc, val) => acc += val.count, 0);
    const totalTime = data.reduce((acc, val) => acc += val.bin * val.count, 0);

    const avg = round(totalTime) / totalCount;

    if (field === VitalsEnum.CLS) {
        return avg.toFixed(3);
    }

    if (avg > 1000) {
        return `${formatMsToSeconds(avg)} s`;
    }

    return `${avg.toFixed(0)} ms`;
}

const formatMsToSeconds = (ms: number): string => {
    return (ms / 1000).toFixed(2);
}

// Function to return percentage of the all thresholds in veb-witals
export const calculateHealthPercentage = (type: VitalsEnum, list: Performance[]): Record<VitalsHealthType, number> => {
    if (!list || list.length === 0) {
        return;
    }

    const totalCount = list.length;
    const threshold = VITALS_THRESHOLD[type];

    const result = Object.entries(threshold).reduce((acc, [key, range]) => {
        const thresholdRange = range as Range;
        const count =
            list.filter(
                (t) => t.value >= thresholdRange.min && t.value < thresholdRange.max
            )?.length || 0;

        acc[key] = Math.round((count / totalCount) * 100);

        return acc;
    }, {}) as Record<VitalsHealthType, number>;

    return result;
};

export const getHealthByValue = (type: VitalsEnum, value: number): VitalsHealthType => {
    const threshold = VITALS_THRESHOLD[type];

    if ((value >= threshold.good.min) && (value <= threshold.good.max)) {
        return "good"
    }

    if ((value >= threshold.need_improvement.min) && (value <= threshold.need_improvement.max)) {
        return "need_improvement"
    }

    if ((value >= threshold.poor.min) && (value <= threshold.poor.max)) {
        return "poor"
    }

    return undefined;
}

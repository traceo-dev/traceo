import { VitalsEnum } from "@traceo/types";

export enum HEALTH_COLOR {
    GOOD = "#0CCE6B",
    NEED_IMPROVEMENT = "#FFA400",
    POOR = "#FF4E42"
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

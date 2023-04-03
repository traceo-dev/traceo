import {
    VitalsBinType,
    VitalsEnum,
    Performance,
    MAP_INTERVAL,
    MAP_MAX_VALUE,
    VitalsHealthType,
    VITALS_THRESHOLD,
    Range
} from "@traceo/types";

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

export const vitalsFormatter = (field: string, value: number) => {
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
            if (value >= 0 && value < 2500) {
                return HEALTH_COLOR.GOOD;
            }

            if (value >= 2500 && value <= 4000) {
                return HEALTH_COLOR.NEED_IMPROVEMENT;
            }

            return HEALTH_COLOR.POOR;
        }
        case VitalsEnum.FID: {
            if (value >= 0 && value < 100) {
                return HEALTH_COLOR.GOOD;
            }

            if (value >= 100 && value <= 300) {
                return HEALTH_COLOR.NEED_IMPROVEMENT;
            }

            return HEALTH_COLOR.POOR;
        }
        case VitalsEnum.CLS: {
            if (value >= 0 && value < 0.1) {
                return HEALTH_COLOR.GOOD;
            }

            if (value >= 0.1 && value <= 0.25) {
                return HEALTH_COLOR.NEED_IMPROVEMENT;
            }

            return HEALTH_COLOR.POOR;
        }
        case VitalsEnum.FP:
        case VitalsEnum.FCP: {
            if (value >= 0 && value < 1000) {
                return HEALTH_COLOR.GOOD;
            }

            if (value >= 1000 && value <= 3000) {
                return HEALTH_COLOR.NEED_IMPROVEMENT;
            }

            return HEALTH_COLOR.POOR;
        }
        default:
            return HEALTH_COLOR.GOOD;
    }
}

export const calculateVitalsAvg = (field: string, data: VitalsBinType[]): string => {
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
    if (!list || list.length === 0 || !type) {
        return;
    }

    const totalCount = list.length;
    const threshold = VITALS_THRESHOLD[type];
    if (!threshold) {
        return;
    }

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

/**
 * Pushing perfs to bins is doing here because of trying to have sync between data in table and in graph
 * 
 * TODO: put this funciton to utils in traceo/types and reuse also in performance.service in backendF
 */
export const parseToBins = (perfs: Performance[]) => {
    if (!perfs || perfs.length === 0) {
        return;
    }

    const vitals = perfs
        .sort((a, b) => a.value - b.value)
        .reduce((acc, val) => {
            acc[val.name] = acc[val.name] || [];
            acc[val.name].push(val.value);

            return acc;
        }, {});

    const pushToBins = (values: number[], INTERVAL = 100, MAX_VALUE = 100) => {
        const bins = [];

        // iterate to the max value in array
        const LAST_VALUE = values[values.length - 1];
        // last_value multipled by 3 get some space in chart after last value 
        const MAX = LAST_VALUE > MAX_VALUE ? LAST_VALUE + INTERVAL * 3 : MAX_VALUE;

        for (let i = 0; i <= MAX; i += INTERVAL) {
            const count = values
                .filter((value) => value >= i && value <= i + INTERVAL)
                .length;

            bins.push({
                bin: i,
                count
            });
        }

        return bins;
    }

    const result = Object.entries(vitals).reduce((acc, [key, value]) => {
        acc[key] = pushToBins(value as number[], MAP_INTERVAL[key], MAP_MAX_VALUE[key]);
        return acc;
    }, {});

    return result;
}

type PercentileCoreType = {
    value: number;
}
export const calculatePercentile = <T extends PercentileCoreType>(data: T[], percentile = 0.75) => {
    if (!data) {
        return;
    }

    const sortedData = data.sort((a, b) => a.value - b.value);

    // Find the index of the value at the percentile
    const percentileIndex = Math.floor(percentile * sortedData.length);

    if (percentileIndex % 1 === 0) {
        return sortedData[percentileIndex - 1]?.value;
    }

    const lowerIndex = Math.floor(percentileIndex);
    const upperIndex = Math.ceil(percentileIndex);
    const lowerValue = sortedData[lowerIndex - 1].value;
    const upperValue = sortedData[upperIndex - 1].value;
    const interpolationFactor = percentileIndex - lowerIndex;

    return lowerValue + interpolationFactor * (upperValue - lowerValue);
}

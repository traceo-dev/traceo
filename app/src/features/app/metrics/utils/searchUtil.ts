import { IMetric } from "types/metrics";

export const searchMetric = (val: string, metrics: IMetric[]) => {
    if (!metrics) {
        return [];
    }

    if (!val) {
        return metrics;
    }

    const searchValue = val.toLowerCase();

    return metrics.filter((metric) =>
        stringIncludes(metric.name, searchValue) ||
        stringIncludes(metric.description, searchValue) ||
        arrayIncludes(metric.series.map((a) => a.field), searchValue) ||
        arrayIncludes(metric.series.map((a) => a.name), searchValue)
    );
}

const stringIncludes = (string: string, value: string | number | boolean) => {
    return string?.toLowerCase().includes(value.toString().toLowerCase());
};

const arrayIncludes = (arr: string[], value: string | number | boolean) => {
    return arr?.some((e) => stringIncludes(e, value));
};
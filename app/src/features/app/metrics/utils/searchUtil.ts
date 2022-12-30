import { IMetric } from "types/metrics";

export const searchMetric = (val: string, metrics: IMetric[]) => {
    if (!val) {
        return metrics;
    }

    const searchValue = val.toLowerCase();

    return metrics.filter((metric) =>
        metric.name.toLowerCase().includes(searchValue) ||
        metric.description.toLowerCase().includes(searchValue)
    );
}
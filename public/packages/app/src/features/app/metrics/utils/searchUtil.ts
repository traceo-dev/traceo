import { stringIncludes, arrayIncludes } from "../../../../core/utils/arrays";
import { IMetric } from "@traceo/types";

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

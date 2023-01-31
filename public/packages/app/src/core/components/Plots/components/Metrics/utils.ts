import dayjs from "dayjs";
import { EChartsOption, SeriesOption } from "echarts";
import { IMetric, IMetricSerie, MetricsResponse, METRIC_UNIT } from "@traceo/types";
import { tooltipOptions, splitLine } from "../../utils";

export type SerieType = "bar" | "line" | "scatter";

export const buildDatasource = (
    datasource: MetricsResponse[],
    series: IMetricSerie[]
) => {
    if (!datasource || !series) {
        return []
    };

    const commonSource = {
        time: datasource?.map((t) => t._time)
    };

    series.map(({ field }) =>
        Object.assign(commonSource, {
            [field]: datasource?.map((m) => m[field])
        })
    );

    return commonSource;

}
export const buildSeries = (
    series: IMetricSerie[],
    options: IMetric,
    type: "card" | "preview" = "preview"
) => {
    const lineWidth = type === "card" ? 1 : options?.config.line.width || 2;
    return series?.map((serie) => ({
        type: serie.config.type,
        name: serie.name,
        showSymbol: options?.config.line.marker.show || false,
        color: serie.config.color,
        lineStyle: {
            color: serie.config.color,
            width: lineWidth
        },
        areaStyle: {
            color: serie.config.color,
            opacity: options?.config.area.show ? options?.config.area.opacity / 100 : 0
        }
    })) as SeriesOption[];
}

export const commonOptions = ({
    unit,
    xAxisInterval = 15
}: {
    unit: METRIC_UNIT,
    xAxisInterval: number
}) => {
    return {
        legend: {
            show: false
        },
        animation: false,
        tooltip: {
            ...tooltipOptions,
            valueFormatter: (v: string) => v ? `${v}${unit}` : "-"
        },
        grid: {
            left: 10,
            top: 10,
            right: 10,
            bottom: 45,
            containLabel: true
        },
        xAxis: {
            type: "category",
            offset: 12,
            axisLabel: {
                formatter: (v: string) => dayjs(v).format("HH:mm"),
                color: "white",
                fontSize: 11,
                interval: xAxisInterval,
                showMaxLabel: true
            },
            axisPointer: {
                label: {
                    formatter: (v: { value: string }) => dayjs(v.value).format("HH:mm, DD MMM")
                }
            },
            splitLine
        },
        yAxis: {
            type: "value",
            axisLabel: {
                color: "white",
                fontSize: 11,
                formatter: `{value} ${unit}`,
                interval: "auto"
            },
            minInterval: 1,
            splitLine
        },
    } as EChartsOption

}

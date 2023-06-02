import {
  DeepPartial,
  IMetric,
  IMetricSerie,
} from "@traceo/types";
import { SeriesOption } from "echarts";

export type SerieType = "bar" | "line" | "scatter";

export const buildSeries = (
  series: DeepPartial<IMetricSerie[]>,
  options: DeepPartial<IMetric>,
  datasource?: [number, number][],
  type: "card" | "preview" = "preview"
): SeriesOption[] => {
  const showSymbol = options.config.line.marker.show || false;
  const symbol = options.config.line.marker.shape || "rect";
  const stack = options.config.stack;

  if (!datasource || datasource.length === 0) {
    return;
  }

  return series
    ?.filter((serie) => serie?.show)
    .map((serie, index) => ({
      type: serie.config.type,
      name: serie.name,
      data: datasource[index],
      showSymbol: showSymbol,
      stack: !stack.show ? undefined : "total",
      stackStrategy: !stack.show ? undefined : stack.strategy,
      symbol: symbol,
      color: serie.config.color,
      lineStyle: {
        color: serie.config.color,
        width: type === "card" ? 1 : serie.config.lineWidth
      },
      barWidth: type === "card" ? 5 : serie.config.barWidth,
      areaStyle: {
        color: serie.config.color,
        opacity: serie.config.area?.show ? serie.config.area.opacity / 100 : 0
      }
    })) as SeriesOption[];
};

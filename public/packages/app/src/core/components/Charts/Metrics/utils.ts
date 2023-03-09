import { DeepPartial, IMetric, IMetricSerie, MetricsResponse, METRIC_UNIT } from "@traceo/types";
import dayjs from "dayjs";
import {
  EChartsOption,
  SeriesOption,
  ToolboxComponentOption,
  TooltipComponentOption
} from "echarts";
import { BaseTooltip } from "../BaseTooltip";

export type SerieType = "bar" | "line" | "scatter";

export const buildDatasource = (datasource: MetricsResponse[], series: IMetricSerie[]) => {
  if (!datasource || !series) {
    return [];
  }

  const commonSource = {
    time: datasource?.map((t) => t._time)
  };

  series.map(({ field }) =>
    Object.assign(commonSource, {
      [field]: datasource?.map((m) => m[field])
    })
  );

  return commonSource;
};
export const buildSeries = (
  series: DeepPartial<IMetricSerie[]>,
  options: DeepPartial<IMetric>,
  type: "card" | "preview" = "preview"
): SeriesOption[] => {
  const showSymbol = options.config.line.marker.show || false;
  return series?.map((serie) => ({
    type: serie.config.type,
    name: serie.name,
    showSymbol: showSymbol,
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

export const commonOptions = ({
  unit,
  xAxisInterval = 15
}: {
  unit: METRIC_UNIT;
  xAxisInterval: number;
}) => {
  return {
    legend: {
      show: false
    },
    animation: false,
    tooltip: {
      ...BaseTooltip(),
      valueFormatter: (v: string) => (v ? `${v}${unit}` : "-")
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
    }
  } as EChartsOption;
};

export const tooltipOptions: TooltipComponentOption = {
  trigger: "axis",
  backgroundColor: "#111217",
  borderColor: "#111217",
  textStyle: {
    color: "white",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
  },
  axisPointer: {
    lineStyle: {
      color: "gray",
      type: "dashed",
      width: 1
    }
  }
};

export const toolboxOptions: ToolboxComponentOption = {
  bottom: 0,
  left: "center",
  itemSize: 16,
  feature: {
    dataZoom: {
      yAxisIndex: "none",
      title: {
        zoom: "zoom",
        back: "undo"
      }
    }
  },
  z: -1
};

export const splitLine = {
  show: true,
  lineStyle: {
    color: "#272A30",
    width: 1
  }
};

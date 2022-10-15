import { EChartsOption } from "echarts";
import { FC } from "react";
import { MetricsResponse } from "types/tsdb";
import ReactECharts from "echarts-for-react";
import { CHART_TYPE, METRIC_TYPE } from "types/metrics";
import { commonOptions, metricConfig } from "./utils";
import { MetricLoading } from "core/components/MetricLoading";

interface Props {
  metrics: MetricsResponse[];
  options?: EChartsOption;
  type: METRIC_TYPE;
  plotType: CHART_TYPE;
}
export const MetricPlot: FC<Props> = ({ metrics, options, type, plotType }) => {
  const { series, unit } = metricConfig[type];

  if (!metrics) {
    return <MetricLoading />;
  }

  const buildSeries = () =>
    series.map(({ area, color, name }) => ({
      type: plotType,
      name,
      showSymbol: false,
      color,
      lineStyle: {
        color,
        width: 2
      },
      areaStyle: {
        color: area?.color || color,
        opacity: area?.opacity || 0.6
      }
    }));

  const buildSources = () => {
    const commonSource = {
      time: metrics.map((t) => t._time)
    };

    series.map(({ field }) =>
      Object.assign(commonSource, {
        [field]: metrics.map((m) => m[field])
      })
    );

    return commonSource;
  };

  const chartOptions: EChartsOption = Object.assign(
    {
      ...commonOptions({ unit }),
      dataset: {
        source: buildSources()
      },
      series: buildSeries()
    },
    options
  );

  return <ReactECharts option={chartOptions} />;
};

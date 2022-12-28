import ReactECharts from "echarts-for-react";
import { StoreState } from "types/store";
import { useSelector } from "react-redux";
import { EChartsOption, SeriesOption } from "echarts";
import { ConditionalWrapper } from "core/components/ConditionLayout";
import { commonOptions } from "./utils";
import { METRIC_UNIT } from "types/tsdb";

export const MetricPreviewPlot = () => {
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);

  if (!metric) {
    return null;
  }

  const buildSeries = () =>
    metric.config.series?.map((serie) => ({
      type: serie.config.type,
      name: serie.name,
      showSymbol: false,
      color: serie.config.color,
      lineStyle: {
        color: serie.config.color,
        width: 1
      },
      areaStyle: {
        color: serie.config.color,
        opacity: 0.4
      }
    }));

  const buildSources = () => {
    const commonSource = {
      time: metric?.datasource?.map((t) => t._time)
    };

    metric?.config.series?.map(({ field }) =>
      Object.assign(commonSource, {
        [field]: metric?.datasource?.map((m) => m[field])
      })
    );

    return commonSource;
  };

  const options: EChartsOption = {
    ...commonOptions({ unit: metric?.config?.unit as METRIC_UNIT }),
    grid: {
      containLabel: true,
      right: 10,
      left: 10,
      bottom: 10,
      top: 10
    },
    series: buildSeries() as SeriesOption[],
    dataset: {
      source: buildSources()
    }
  };

  return (
    <ConditionalWrapper isLoading={!hasFetchedMetric}>
      <ReactECharts option={options} />
    </ConditionalWrapper>
  );
};

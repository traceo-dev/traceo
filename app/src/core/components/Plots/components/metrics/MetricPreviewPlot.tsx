import ReactECharts from "echarts-for-react";
import { StoreState } from "types/store";
import { useSelector } from "react-redux";
import { EChartsOption, SeriesOption } from "echarts";
import { ConditionalWrapper } from "core/components/ConditionLayout";
import { commonOptions } from "./utils";
import { METRIC_UNIT } from "types/tsdb";
import { tooltipOptions } from "../../utils";
import { FC } from "react";
import { IMetric } from "types/metrics";
import { DeepPartial } from "types/partials";
import { DataNotFound } from "core/components/DataNotFound";

interface Props {
  options: DeepPartial<IMetric>;
  isExpandMode: boolean;
}
export const MetricPreviewPlot: FC<Props> = ({ options, isExpandMode }) => {
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);

  const buildSeries = () =>
    metric.options.series?.map((serie) => ({
      type: serie.config.type,
      name: serie.name,
      showSymbol: options?.config.line.marker.show || false,
      color: serie.config.color,
      lineStyle: {
        color: serie.config.color,
        width: options?.config.line.width || 2
      },
      areaStyle: {
        color: serie.config.color,
        opacity: options?.config.area.show ? options?.config.area.opacity / 100 : 0
      }
    }));

  const buildSources = () => {
    const commonSource = {
      time: metric?.datasource?.map((t) => t._time)
    };

    metric?.options.series?.map(({ field }) =>
      Object.assign(commonSource, {
        [field]: metric?.datasource?.map((m) => m[field])
      })
    );

    return commonSource;
  };

  const showTooltip = options?.config.tooltip.show;
  const showLegend = options?.config.legend.show;
  const unit = options?.unit;

  const echartsOptions: EChartsOption = {
    ...commonOptions({ unit: unit as METRIC_UNIT }),
    tooltip: {
      show: showTooltip,
      ...tooltipOptions
    },
    legend: {
      show: showLegend,
      orient: "vertical",
      right: 10,
      top: "center",
      textStyle: {
        color: "#ffffff"
      },
      icon: "roundRect",
      itemHeight: 5
    },
    grid: {
      containLabel: true,
      right: showLegend ? 120 : 10,
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
    <ConditionalWrapper
      isEmpty={metric?.datasource.length === 0}
      isLoading={!hasFetchedMetric || !metric || !options}
      emptyView={<DataNotFound />}
    >
      <ReactECharts
        style={{
          height: isExpandMode ? "500px" : "300px"
        }}
        option={echartsOptions}
      />
    </ConditionalWrapper>
  );
};

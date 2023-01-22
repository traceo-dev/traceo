import { StoreState } from "../../../../../types/store";
import { useSelector } from "react-redux";
import { ConditionalWrapper } from "../../../../../core/components/ConditionLayout";
import { buildDatasource, buildSeries, commonOptions } from "./utils";
import { tooltipOptions } from "../../utils";
import { FC, lazy, useMemo } from "react";
import { IMetric, METRIC_UNIT } from "../../../../../types/metrics";
import { DeepPartial } from "../../../../../types/partials";
import { DataNotFound } from "../../../../../core/components/DataNotFound";

interface Props {
  options: DeepPartial<IMetric>;
  isExpandMode: boolean;
}
const ReactECharts = lazy(() => import("echarts-for-react"));
const MetricPreviewPlot: FC<Props> = ({ options, isExpandMode }) => {
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);

  const showTooltip = options?.config.tooltip.show;
  const showLegend = options?.config.legend.show;
  const unit = options?.unit;

  const echartOptions = useMemo(() => {
    return {
      ...commonOptions({
        unit: unit as METRIC_UNIT,
        xAxisInterval: 15
      }),
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
      series: buildSeries(metric.options.series, metric.options, "preview"),
      dataset: {
        source: buildDatasource(metric.datasource, metric.options.series)
      }
    };
  }, [metric]);

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
        option={echartOptions}
      />
    </ConditionalWrapper>
  );
};

export default MetricPreviewPlot;

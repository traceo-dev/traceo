import { StoreState } from "@store/types";
import { useSelector } from "react-redux";
import { ConditionalWrapper } from "../../../ConditionLayout";
import { buildDatasource, buildSeries, commonOptions } from "./utils";
import { tooltipOptions } from "../../utils";
import { FC, lazy, useMemo } from "react";
import { IMetric, METRIC_UNIT, DeepPartial } from "@traceo/types";
import { DataNotFound } from "../../../DataNotFound";

interface Props {
  options: DeepPartial<IMetric>;
  isExpandMode: boolean;
}
const ReactECharts = lazy(() => import("echarts-for-react"));
const MetricPreviewPlot: FC<Props> = ({ options, isExpandMode }) => {
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);

  const showTooltip = options?.config.tooltip.show;
  const showLegend = options?.config.legend.show;
  const legendOrient = options?.config.legend.orient;
  const unit = options?.unit;

  const echartOptions = useMemo(() => {
    const seriesOptions = buildSeries(
      options?.series || metric.options.series,
      options || metric.options,
      "preview"
    );
    const dataSourceOptions = buildDatasource(metric.datasource, metric.options.series);

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
        orient: legendOrient,
        right: legendOrient === "vertical" ? 10 : null,
        bottom: legendOrient === "horizontal" ? null : 10,
        top: legendOrient === "vertical" ? "center" : "bottom",
        left: legendOrient === "horizontal" ? 40 : null,
        textStyle: {
          color: "#ffffff"
        },
        icon: "roundRect",
        itemHeight: 5
      },
      grid: {
        containLabel: true,
        right: showLegend && legendOrient === "vertical" ? 120 : 10,
        left: 10,
        bottom: showLegend ? (legendOrient === "vertical" ? 10 : 50) : 10,
        top: 10
      },
      series: seriesOptions,
      dataset: {
        source: dataSourceOptions
      }
    };
  }, [metric, options]);

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

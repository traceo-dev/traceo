import { buildSeries } from "./utils";
import { StoreState } from "@store/types";
import { IMetric, DeepPartial, METRIC_UNIT } from "@traceo/types";
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { ConditionalWrapper } from "../../ConditionLayout";
import { DataNotFound } from "../../DataNotFound";
import { BaseChart } from "../BaseChart";
import { BaseXAxis } from "../BaseXAxis";
import dayjs from "dayjs";
import { BaseYAxis } from "../BaseYAxis";
import { BaseTooltip } from "../BaseTooltip";
import { EchartDataZoomProps } from "../types";

interface Props {
  options: DeepPartial<IMetric>;
  setRanges?: (val: [number, number]) => void;
  activeZoomSelect?: boolean;
  isNewMetric?: boolean;
}
const MetricPreviewChart: FC<Props> = ({
  options,
  activeZoomSelect = false,
  isNewMetric = false,
  setRanges
}) => {
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);

  const showTooltip = options?.config.tooltip.show;
  const showLegend = options?.config.legend.show;
  const showXAxis = options?.config.axis.showX;
  const showYAxis = options?.config.axis.showY;
  const showGridLines = options?.config.axis.showGridLines;
  const legendOrient = options?.config.legend.orient;
  const unit = options?.unit === METRIC_UNIT.NONE ? "" : options?.unit;

  const echartOptions = useMemo(() => {
    const seriesOptions = buildSeries(
      options?.series || metric.options.series,
      options || metric.options,
      metric?.datasource,
      "preview"
    );

    return {
      tooltip: BaseTooltip({
        show: showTooltip,
        pointer: "line"
      }),
      legend: {
        show: showLegend,
        orient: legendOrient as any,
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
      series: seriesOptions
    };
  }, [metric, options]);

  const onDataZoom = (params: EchartDataZoomProps) => {
    if (isNewMetric) {
      return;
    }

    const { startValue, endValue } = params.batch[0];
    if (startValue && endValue) {
      const selected = metric?.datasource?.time.slice(startValue, endValue);
      const from = dayjs.unix(selected[0]).unix();
      const to = dayjs.unix(selected[selected.length - 1]).unix();

      setRanges([from, to]);
    }
  };

  const isLoading = isNewMetric ? false : !hasFetchedMetric || !metric || !options;
  const isEmpty =
    !metric?.datasource || !metric.datasource?.time || metric?.datasource.time.length === 0;

  return (
    <ConditionalWrapper isEmpty={isEmpty} isLoading={isLoading} emptyView={<DataNotFound />}>
      <BaseChart
        height={"300px"}
        renderer="canvas"
        onDataZoom={onDataZoom}
        activeZoomSelect={activeZoomSelect}
        series={echartOptions.series}
        tooltip={echartOptions.tooltip}
        legend={echartOptions.legend}
        grid={echartOptions.grid}
        xAxis={BaseXAxis({
          splitLine: {
            show: showGridLines
          },
          offset: 12,
          axisLabel: {
            show: showXAxis,
            showMaxLabel: true
          },
          labelFormatter: (v: unknown) => dayjs.unix(Number(v)).format("HH:mm"),
          pointerFormatter: (v: unknown) => dayjs.unix(Number(v)).format("HH:mm, DD MMM"),
          data: metric?.datasource?.time || []
        })}
        yAxis={BaseYAxis({
          splitLine: {
            show: showGridLines
          },
          axisLabel: {
            show: showYAxis,
            formatter: `{value} ${unit}`,
            interval: "auto"
          },
          minInterval: 1
        })}
      />
    </ConditionalWrapper>
  );
};

export default MetricPreviewChart;

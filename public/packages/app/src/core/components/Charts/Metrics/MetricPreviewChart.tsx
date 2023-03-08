import { buildDatasource, buildSeries } from "./utils";
import { StoreState } from "@store/types";
import { IMetric, DeepPartial } from "@traceo/types";
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { ConditionalWrapper } from "../../ConditionLayout";
import { DataNotFound } from "../../DataNotFound";
import { BaseChart } from "../BaseChart";
import { BaseXAxis } from "../BaseXAxis";
import dayjs from "dayjs";
import { BaseYAxis } from "../BaseYAxis";
import { BaseTooltip } from "../BaseTooltip";

interface Props {
  options: DeepPartial<IMetric>;
  isExpandMode: boolean;
}
const MetricPreviewChart: FC<Props> = ({ options, isExpandMode }) => {
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
      tooltip: {
        ...BaseTooltip(),
        show: showTooltip
      },
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
      <BaseChart
        height={isExpandMode ? "500px" : "300px"}
        renderer="canvas"
        dataset={echartOptions.dataset}
        series={echartOptions.series}
        tooltip={echartOptions.legend}
        legend={echartOptions.legend}
        grid={echartOptions.grid}
        xAxis={BaseXAxis({
          offset: 12,
          axisLabel: {
            interval: 15,
            showMaxLabel: true
          },
          labelFormatter: (v: unknown) => dayjs(v as any).format("HH:mm"),
          pointerFormatter: (v: unknown) => dayjs(v as any).format("HH:mm, DD MMM")
        })}
        yAxis={BaseYAxis({
          axisLabel: {
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

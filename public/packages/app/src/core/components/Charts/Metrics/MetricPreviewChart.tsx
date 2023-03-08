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
import { EchartDataZoomProps } from "../types";

interface Props {
  options: DeepPartial<IMetric>;
  isExpandMode: boolean;
  setRanges: (val: [number, number]) => void;
}
const MetricPreviewChart: FC<Props> = ({ options, isExpandMode, setRanges }) => {
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);

  const showTooltip = options?.config.tooltip.show;
  const showLegend = options?.config.legend.show;
  const legendOrient = options?.config.legend.orient;
  const unit = options?.unit;

  const dataSourceOptions = useMemo(
    () => buildDatasource(metric.datasource, metric.options.series),
    [metric]
  );
  console.log("datasource: ", dataSourceOptions);

  const echartOptions = useMemo(() => {
    const seriesOptions = buildSeries(
      options?.series || metric.options.series,
      options || metric.options,
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
      series: seriesOptions,
      dataset: {
        source: dataSourceOptions
      }
    };
  }, [metric, options]);

  const onDataZoom = (params: EchartDataZoomProps) => {
    const { startValue, endValue } = params.batch[0];
    if (startValue && endValue && dataSourceOptions["time"]) {
      const selected = dataSourceOptions["time"].slice(startValue, endValue);
      const from = dayjs(selected[0]).unix();
      const to = dayjs(selected[selected.length - 1]).unix();

      setRanges([from, to]);
    }
  };

  return (
    <ConditionalWrapper
      isEmpty={metric?.datasource.length === 0}
      isLoading={!hasFetchedMetric || !metric || !options}
      emptyView={<DataNotFound />}
    >
      <BaseChart
        height={isExpandMode ? "500px" : "300px"}
        renderer="canvas"
        onDataZoom={onDataZoom}
        activeZoomSelect={true}
        dataset={echartOptions.dataset}
        series={echartOptions.series}
        tooltip={echartOptions.tooltip}
        legend={echartOptions.legend}
        grid={echartOptions.grid}
        xAxis={BaseXAxis({
          offset: 12,
          axisLabel: {
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

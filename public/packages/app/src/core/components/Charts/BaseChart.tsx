import { LoadingOutlined } from "@ant-design/icons";
import {
  EChartsCoreOption,
  EChartsOption,
  GridComponentOption,
  SeriesOption,
  XAXisComponentOption,
  YAXisComponentOption
} from "echarts";
import { EChartsInstance } from "echarts-for-react";
import EChartsReactCore from "echarts-for-react/lib/core";
import { lazy, forwardRef } from "react";
import { EchartDataZoomProps, EchartLegendProps, EchartOnClickProps } from "./types";

const ReactECharts = lazy(() => import("echarts-for-react"));

export interface BaseChartProps {
  animation?: boolean;
  activeZoomSelect?: boolean;
  dataset?: EChartsOption["dataset"];
  dataZoom?: EChartsOption["dataZoom"];
  grid?: GridComponentOption;
  height?: string | number;
  legend?: EChartsOption["legend"];
  legendPosition?: "vertical" | "horizontal";
  isLoading?: boolean;
  forwardedRef?: React.Ref<EChartsReactCore>;
  renderer?: "svg" | "canvas";
  series?: SeriesOption | SeriesOption[];
  // Use BaseDataZoom wrapper instead of plain object
  toolBox?: EChartsOption["toolbox"];
  // Use BaseTooltip wrapper instead of plain object
  tooltip?: EChartsOption["tooltip"];
  width?: string | number;
  // Use XAxis wrapper instead of plain object
  xAxis?: XAXisComponentOption;
  // Use YAxis wrapper instead of plain object
  yAxis?: YAXisComponentOption;

  onDataZoom?: (params: EchartDataZoomProps) => void;
  onLegendChange?: (params: EchartLegendProps) => void;
  onClick?: (params: EchartOnClickProps) => void;
}

const BaseChartComponent = ({
  activeZoomSelect = false,
  animation = false,
  height = 100,
  width = "100%",
  dataset = null,
  xAxis = {},
  yAxis = {},
  series = {},
  isLoading = false,
  legend = null,
  legendPosition = "horizontal",
  dataZoom = null,
  grid = null,
  toolBox = null,
  tooltip = null,
  forwardedRef = null,
  renderer = "svg",
  onDataZoom,
  onLegendChange,
  onClick
}: BaseChartProps) => {
  const onChartReady = (chart: EChartsInstance) => {
    if (activeZoomSelect) {
      chart.dispatchAction({
        type: "takeGlobalCursor",
        key: "dataZoomSelect",
        dataZoomSelectActive: true
      });
    }
  };

  const coreGrid: GridComponentOption = !grid
    ? {
        bottom: legend && legendPosition === "horizontal" ? "50px" : "10px",
        right: legend && legendPosition === "vertical" ? "50px" : "10px",
        left: "10px",
        top: "10px",
        containLabel: true
      }
    : grid;

  const coreOptions: EChartsCoreOption = {
    animation,
    dataset,
    xAxis,
    yAxis,
    series,
    legend,
    dataZoom,
    tooltip,
    toolBox,
    grid: coreGrid,
    renderer: "svg",
    toolbox: activeZoomSelect
      ? {
          feature: {
            dataZoom: {
              title: {
                zoom: " ",
                back: " "
              },
              yAxisIndex: "none" as const,
              iconStyle: {
                borderWidth: 0,
                color: "transparent",
                opacity: 0
              }
            }
          }
        }
      : {}
  };

  const events = {
    click: (props) => onClick?.(props),
    datazoom: (props) => onDataZoom?.(props),
    legendselectchanged: (props) => onLegendChange?.(props)
  };

  if (isLoading) {
    return (
      <div className="w-full text-center justify-center">
        <LoadingOutlined />
      </div>
    );
  }

  return (
    <ReactECharts
      ref={forwardedRef}
      onEvents={events}
      onChartReady={onChartReady}
      style={{ height, width }}
      option={coreOptions}
      opts={{
        renderer
      }}
    />
  );
};

export const BaseChart = forwardRef<EChartsReactCore, BaseChartProps>((props, ref) => (
  <BaseChartComponent forwardedRef={ref} {...props} />
));

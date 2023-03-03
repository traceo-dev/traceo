import {
  EChartsOption,
  GridComponentOption,
  SeriesOption,
  XAXisComponentOption,
  YAXisComponentOption
} from "echarts";
import { EChartsInstance } from "echarts-for-react";
import EChartsReactCore from "echarts-for-react/lib/core";
// import type ReactEchartsCore from "echarts-for-react/lib/core";

import { lazy, forwardRef, useEffect } from "react";
import { useEffectOnce } from "react-use";
import { BaseLegend } from "./BaseLegend";

const ReactECharts = lazy(() => import("echarts-for-react"));

export interface BaseChartProps {
  animation?: boolean;
  activeZoomSelect?: boolean;
  dataZoom?: EChartsOption["dataZoom"];
  grid?: GridComponentOption;
  height?: string | number;
  legend?: EChartsOption["legend"];
  legendPosition?: "vertical" | "horizontal";
  forwardedRef?: React.Ref<EChartsReactCore>;
  series?: SeriesOption;
  // Use BaseDataZoom wrapper instead of plain object
  toolBox?: EChartsOption["toolbox"];
  // Use BaseTooltip wrapper instead of plain object
  tooltip?: EChartsOption["tooltip"];
  width?: string | number;
  // Use XAxis wrapper instead of plain object
  xAxis?: XAXisComponentOption;
  // Use YAxis wrapper instead of plain object
  yAxis?: YAXisComponentOption;

  onDataZoom?: (params: any) => void;
  onLegendChange?: (params: any) => void;
  onClick?: (params: any) => void;
  onDoubleClick?: (params: any) => void;
}

const BaseChartComponent = ({
  activeZoomSelect = false,
  animation = false,
  height = 100,
  width = null,
  xAxis = {},
  yAxis = {},
  series = {},
  legend = {},
  legendPosition = "horizontal",
  dataZoom = {},
  grid = {},
  toolBox = {},
  tooltip = {},
  forwardedRef = null,
  onDataZoom,
  onLegendChange,
  onClick,
  onDoubleClick
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

  const coreOptions: EChartsOption = {
    animation,
    xAxis,
    yAxis,
    series,
    legend,
    dataZoom,
    tooltip,
    toolBox,
    grid: coreGrid,
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
    dblclick: (props) => onDoubleClick?.(props),
    datazoom: (props) => onDataZoom?.(props),
    legendselectchanged: (props) => onLegendChange?.(props)
  };

  return (
    <ReactECharts
      ref={forwardedRef}
      onEvents={events}
      onChartReady={onChartReady}
      style={{ height }}
      option={coreOptions}
    />
  );
};

export const BaseChart = forwardRef<EChartsReactCore, BaseChartProps>((props, ref) => (
  <BaseChartComponent forwardedRef={ref} {...props} />
));

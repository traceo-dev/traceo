import { ToolboxComponentOption, TooltipComponentOption } from "echarts";

export const tooltipOptions: TooltipComponentOption = {
  trigger: "axis",
  backgroundColor: "#111217",
  borderColor: "#111217",
  textStyle: {
    color: "white",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
  },
  axisPointer: {
    lineStyle: {
      color: "gray",
      type: "dashed",
      width: 1
    }
  }
}

export const toolboxOptions: ToolboxComponentOption = {
  bottom: 0,
  left: "center",
  itemSize: 16,
  feature: {
    dataZoom: {
      yAxisIndex: "none",
      title: {
        zoom: "zoom",
        back: "undo"
      }
    }
  },
  z: -1
}

export const splitLine = {
  show: true,
  lineStyle: {
    color: "#272A30",
    width: 1
  }
};

export const normalizePlotData = (plotData: { date: number; count: number }[]) => {
  const x: number[] = [];
  const y: number[] = [];

  plotData?.map((d) => {
    x.push(d.date);
    y.push(d.count);
  });

  return {
    x,
    y
  };
};

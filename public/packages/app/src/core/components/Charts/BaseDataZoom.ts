import { DataZoomComponentOption } from "echarts";

export const BaseDataZoom = (props?: DataZoomComponentOption): DataZoomComponentOption => ({
  type: "inside",
  xAxisIndex: [0],
  zoomOnMouseWheel: false,
  zoomLock: true,
  throttle: 50,
  ...props
});

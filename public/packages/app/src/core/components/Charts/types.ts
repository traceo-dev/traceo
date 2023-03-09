export type EchartLegendProps = {
  // Name of the clicked legend item
  name: string;
  // Event name = legendselectchanged
  type: string;
  // Selected/Unselected legend items
  selected: Record<string, boolean>;
};

export type EchartDataZoomProps = {
  // Event type
  type: string;
  batch: DataZoomBatch[];
};

type DataZoomBatch = {
  dataZoomId: string;
  startValue: number;
  endValue: number;
  // "toolbox-feature_3318"
  from: string;
  // "datazoom"
  type: string;
};

export type EchartOnClickProps = {
  borderColor: string;
  color: string;
  componentIndex: number;
  // Serie type = "line" | "bar" | etc.
  componentSubType: string;
  // "series"
  componentType: string;
  data: number;
  dataIndex: number;
  name: string;
  seriesId: string;
  seriesIndex: number;
  seriesName: string;
  seriesType: string;
  // Event type
  type: string;
  value: number;
};

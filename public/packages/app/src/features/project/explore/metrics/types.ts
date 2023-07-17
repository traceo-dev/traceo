import { UplotDataType } from "@traceo/types";

export type ExploreMetricsResponseType = {
  datasource: UplotDataType;
};

export type ExploreGraphProps = {
  fields: string[];
  from: number;
  to: number;
  interval: number;
  valueMax: number;
  valueMin: number;
};

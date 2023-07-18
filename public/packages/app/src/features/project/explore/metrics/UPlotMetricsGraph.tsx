import {
  EXPLORE_PLOT_TYPE,
  ExploreSerieType,
  PLOT_TYPE,
  Setter,
  TimeRange,
  UplotDataType
} from "@traceo/types";
import { useMemo } from "react";
import BaseUPlotChart from "../../../../core/components/UPlot/BaseUPlotChart";
import { UPlotConfigBuilder } from "../../../../core/components/UPlot/UPlotConfigBuilder";
import { hook } from "../../../../core/components/UPlot/hooks";
import { getFillOpacity } from "../../../../core/components/UPlot/utils";
import { calculateOpacity } from "../../../../core/utils/colors";

interface Props {
  datasource: UplotDataType;
  series: ExploreSerieType[];
  onZoom?: Setter<TimeRange>;
  type: EXPLORE_PLOT_TYPE;
  stacked: boolean;
  markers: boolean;
}

const mapToUplotType: Record<EXPLORE_PLOT_TYPE, PLOT_TYPE> = {
  bar: PLOT_TYPE.BAR,
  area: PLOT_TYPE.LINE,
  line: PLOT_TYPE.LINE,
  points: PLOT_TYPE.POINTS
};

export const UPlotMetricsGraph = ({
  datasource = [[]],
  series = [],
  onZoom = undefined,
  type = "line",
  stacked = false,
  markers = false
}: Props) => {
  const configs = useMemo(() => {
    const chartType = mapToUplotType[type];
    const builder = new UPlotConfigBuilder();
    for (const serie of series) {
      builder.addSerie({
        type: chartType,
        stroke: serie.color,
        width: 1,
        fill: calculateOpacity(serie.color, getFillOpacity(type)),
        points: {
          show: markers
        },
        label: serie.name,
        bar: {
          width: 75,
          align: 1
        }
      });
    }

    return builder
      .addBase({
        height: 400,
        stacked,
        data: datasource
      })
      .addLegend({
        show: true
      })
      .addAxe({ scale: "x", isTimeAxis: true })
      .addAxe({ scale: "y" })
      .addScale({
        x: {
          time: true,
          auto: false
        }
      })
      .addHook("setSelect", (self: uPlot) => hook.setSelect(self, onZoom))
      .addTooltip({})
      .build();
  }, [type, stacked, markers, datasource]);

  return <BaseUPlotChart configs={configs} />;
};

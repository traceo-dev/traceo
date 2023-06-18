import { PLOT_TYPE, UplotDataType } from "@traceo/types";
import { useMemo } from "react";
import BaseUPlotChart from "src/core/components/UPlot/BaseUPlotChart";
import { UPlotConfigBuilder } from "src/core/components/UPlot/UPlotConfigBuilder";

interface Props {
  data: UplotDataType;
}

export const UPlotTodayEventsGraph = ({ data }: Props) => {
  const configs = useMemo(() => {
    const builder = new UPlotConfigBuilder();

    return builder
      .addBase({
        height: 200,
        data: data,
        isZoom: false
      })
      .addSerie({
        type: PLOT_TYPE.BAR,
        stroke: "#3B82F5",
        fill: "#3B82F5",
        points: {
          show: false
        },
        label: "Events"
      })
      .addAxe({ scale: "x", isTimeAxis: true })
      .addAxe({ scale: "y" })
      .addScale({
        x: {
          auto: false
        }
      })
      .addLegend({})
      .addTooltip({})
      .build();
  }, []);

  return <BaseUPlotChart configs={configs} />;
};

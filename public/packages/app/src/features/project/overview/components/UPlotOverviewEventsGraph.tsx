import { PLOT_TYPE } from "@traceo/types";
import { useMemo } from "react";
import BaseUPlotChart from "../../../../core/components/UPlot/BaseUPlotChart";
import { UPlotConfigBuilder } from "../../../../core/components/UPlot/UPlotConfigBuilder";

interface Props {
  data: any; //number[][]
}
export const UPlotOverviewEventsGraph = ({ data }: Props) => {
  const configs = useMemo(() => {
    const builder = new UPlotConfigBuilder();

    return builder
      .addBase({
        height: 250,
        data: data,
        isZoom: false
      })
      .addSerie({
        type: PLOT_TYPE.BAR,
        stroke: "#3B82F5",
        fill: "#3B82F5",
        width: 0,
        points: {
          show: false
        },
        label: "Events",
        bar: {
          width: 100,
          align: 1
        }
      })
      .addAxe({ scale: "x", isTimeAxis: true })
      .addAxe({ scale: "y", showFloatLabels: false })
      .addScale({
        x: {
          time: true,
          auto: false
        }
      })
      .addLegend({})
      .addTooltip({})
      .build();
  }, []);

  return <BaseUPlotChart configs={configs} />;
};

import { PLOT_TYPE, UplotDataType } from "@traceo/types";
import { useMemo } from "react";
import BaseUPlotChart from "../../../../core/components/UPlot/BaseUPlotChart";
import { UPlotConfigBuilder } from "../../../../core/components/UPlot/UPlotConfigBuilder";
import dateUtils from "../../../../core/utils/date";

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
        width: 0,
        points: {
          show: false
        },
        bar: {
          width: 90,
          align: 1
        },
        label: "Events"
      })
      .addAxe({
        scale: "x",
        isTimeAxis: true,
        formatter: (_self, splits, _axisIdx, _foundSpace, _foundIncr) => {
          const splitsCount = splits.length - 1;
          // Last value should be formatted to 23:59 for todays plot instead of 00:00
          return splits.map((split, index) => {
            if (index === splitsCount) {
              return "23:59";
            }

            return dateUtils.formatDate(split, "HH:mm");
          });
        }
      })
      .addAxe({ scale: "y", showFloatLabels: false })
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

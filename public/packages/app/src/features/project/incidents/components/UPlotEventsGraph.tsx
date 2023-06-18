import { IEvent, IIncident, PLOT_TYPE, UplotDataType } from "@traceo/types";
import dayjs from "dayjs";
import { useMemo } from "react";
import BaseUPlotChart from "src/core/components/UPlot/BaseUPlotChart";
import { UPlotConfigBuilder } from "src/core/components/UPlot/UPlotConfigBuilder";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { localStorageService } from "src/core/lib/localStorage";
import { LocalStorage } from "src/core/lib/localStorage/types";

interface Props {
  incident: IIncident;
}
export const UPlotEventsGrap = ({ incident }: Props) => {
  const plotType = localStorageService.get<any>(LocalStorage.PlotType) || "bar";

  const {
    data = {
      graph: [[]]
    },
    isLoading
  } = useReactQuery<{
    graph: UplotDataType;
  }>({
    queryKey: [`grouped_events_${incident.id}`],
    url: `/api/event/graph/incident-overview`,
    params: {
      id: incident.id,
      from: dayjs.unix(incident.createdAt).subtract(3, "days").unix()
    }
  });

  console.log("data: ", data);

  const configs = useMemo(() => {
    const builder = new UPlotConfigBuilder();

    return builder
      .addBase({
        height: 60,
        data: data.graph,
        isZoom: false
      })
      .addSerie({
        type: plotType as PLOT_TYPE,
        stroke: "#3B82F5",
        fill: "#3B82F5",
        points: {
          show: false
        },
        label: "Events"
      })
      .addAxe({ scale: "x", isTimeAxis: true, show: false })
      .addAxe({
        scale: "y"
      })
      .addScale({
        x: {
          time: true,
          auto: false
        }
      })
      .addTooltip({})
      .build();
  }, [data, plotType]);

  return <BaseUPlotChart configs={configs} />;
};

import { TotalOverviewType } from "../../../../features/project/overview/components/OverviewSection";
import { useRequest } from "../../../hooks/useRequest";
import dateUtils from "../../../utils/date";
import { statisticUtils } from "../../../utils/statistics";
import { FC, useEffect } from "react";
import { BaseChart } from "../BaseChart";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import { BaseTooltip } from "../BaseTooltip";
import { normalizePlotData } from "../utils";
import { SearchOutlined } from "@ant-design/icons";

interface Props {
  id: string;
}
const PLOT_COLOR = "#04785A";
const IncidentListOverviewChart: FC<Props> = ({ id }) => {
  const { data: stats, execute } = useRequest<TotalOverviewType>({
    url: "/api/statistics/total",
    params: {
      id
    }
  });

  useEffect(() => {
    execute();
  }, [id]);

  const plotData = statisticUtils.parseIncidentsTablePlotData(stats?.errors);
  const datasource = normalizePlotData(plotData);

  const formatter = (v: unknown) => dateUtils.formatDate(Number(v), "MMM D, YYYY");

  if (stats && stats.errors.length === 0) {
    return (
      <div className="w-full text-center flex flex-col text-primary">
        <SearchOutlined className="text-lg" />
        <span className="text-xs font-semibold">Data not found</span>
      </div>
    );
  }
  return (
    <BaseChart
      height="70px"
      dataset={{
        source: datasource
      }}
      series={{
        name: "Errors",
        type: "bar",
        color: "#04785A",
        itemStyle: {
          borderColor: "#04785A",
          borderWidth: 2,
          borderRadius: 0
        },
        barWidth: 10,
        barGap: "5%"
      }}
      xAxis={BaseXAxis({
        pointerFormatter: formatter,
        show: false
      })}
      yAxis={BaseYAxis({
        axisLabel: {
          showMinLabel: false,
          hideOverlap: true,
          color: "#CCCCDC",
          fontSize: 10
        },
        // Props to show only max value on yAxis
        max: (e) => {
          return e.max;
        },
        min: 0,
        interval: 99999
      })}
      tooltip={BaseTooltip({
        pointer: "shadow"
      })}
      grid={{
        left: "25px",
        right: "5px",
        top: "10px",
        bottom: "5px"
      }}
    />
  );
};

export default IncidentListOverviewChart;

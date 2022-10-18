import { normalizePlotData } from "core/components/Plots/utils";
import dayjs from "dayjs";
import { TraceoLog } from "types/logs";
import { ErrorDetails } from "../../types/incidents";

export const getIncidentsTablePlotData = (occurDates: ErrorDetails[]) => {
  const response: PlotData[] = []; //initial values

  const occurs = [...occurDates];
  const sortedDates = occurs?.sort((a, b) => a?.date - b?.date);
  const beginDate = occurDates?.at(0);

  let currentDate = dayjs.unix(beginDate?.date).subtract(3, "day").endOf("day").unix();
  const endDate = dayjs().endOf("day").unix();

  /**
   * iterate over the two dates, first and last date of incidents
   * and push to array new object with count of incidents by day,
   *
   * response is an array of counts eq. [0,0,0,4,2,6,8]
   */
  while (currentDate <= endDate) {
    const formatted = dayjs.unix(currentDate).endOf("day").unix();
    const count = sortedDates?.filter(
      (a) => dayjs.unix(a?.date).endOf("day").unix() === formatted
    ).length;
    response.push({
      date: formatted,
      count: count || 0
    });
    currentDate = dayjs.unix(currentDate).add(1, "day").endOf("day").unix();
  }

  return response;
};

export interface PlotData {
  date: number;
  count: number;
}
const getIncidentsAnalyticsTodayPlotData = (occurDates: ErrorDetails[]) => {
  const todayIncidents = occurDates?.filter((o) => dayjs.unix(o.date).isToday());

  todayIncidents?.map((today) => {
    dayjs.unix(today.date).hour();
  });

  const response: PlotData[] = [];

  for (let i = 0; i <= 24; i++) {
    const count = todayIncidents?.filter((t) => dayjs.unix(t.date).hour() === i)?.length;
    response.push({
      date: dayjs().hour(i).startOf("h").unix(),
      count
    });
  }

  const yesterdayIncidents = occurDates?.filter((o) =>
    dayjs.unix(o.date).isYesterday()
  )?.length;

  return {
    data: response,
    count: todayIncidents?.length,
    last: todayIncidents[todayIncidents?.length - 1]?.date || null,
    diff: {
      isMore: todayIncidents?.length > yesterdayIncidents,
      value: String(todayIncidents?.length - yesterdayIncidents)
    }
  };
};

const getExploreLogsPlotData = (startDate: number, endDate: number, logs: TraceoLog[]) => {
  const plotData: PlotData[] = [];

  let currentDate = startDate;
  const endPlotDate = endDate;

  while (currentDate <= endPlotDate) {
    const count = logs?.filter(
      (a) =>
        dayjs.unix(a.receiveTimestamp).format("HH:mm") ===
        dayjs.unix(currentDate).format("HH:mm")
    ).length;
    plotData.push({
      date: currentDate,
      count
    });
    currentDate = dayjs.unix(currentDate).add(1, "minute").unix();
  }

  const data = normalizePlotData(plotData);
  return data;
};

export const statistics = {
  getIncidentsAnalyticsTodayPlotData,
  getExploreLogsPlotData
};

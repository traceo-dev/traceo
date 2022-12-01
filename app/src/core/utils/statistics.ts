import { normalizePlotData } from "../../core/components/Plots/utils";
import dayjs from "dayjs";
import { TraceoLog } from "../../types/logs";
import { ErrorDetails } from "../../types/incidents";
import { DailyStats } from "../../types/statistics";
import dateUtils from "./date";

/**
 * TODO: This utils are to total refactoring. Rubbish.
 * 
 * QA: Why data to plots are parsing on app? 
 * Because I need to use local timezone instead of utc. Maybe I should save used timezone 
 * in app object and parse this on backend side?
 */

const parseIncidentsTablePlotData = (errorsDetails: ErrorDetails[]) => {
  const data: PlotData[] = []; //initial values

  if (!errorsDetails) {
    return;
  }

  const errors = [...errorsDetails];
  const sortedDates = errors?.sort((a, b) => a?.date - b?.date);
  const beginDate = errorsDetails[0];

  let currentDate = dateUtils.endOf(dayjs.unix(beginDate?.date).subtract(3, "day").unix())
  while (currentDate <= dateUtils.endOf()) {
    const currentErrors = sortedDates.filter(({ date }) => dateUtils.endOf(date) === dateUtils.endOf(currentDate));
    data.push({ date: dateUtils.endOf(currentDate), count: currentErrors?.length });
    currentDate = dateUtils.endOf(dayjs.unix(currentDate).add(1, "day").unix());
  }

  // const response = normalizePlotData(data)
  return data;
};

export interface PlotData {
  date: any;
  count: number;
}
const parseIncidentsAnalyticsTodayPlotData = (errorsDetails: ErrorDetails[]) => {
  const response: PlotData[] = [];

  const todayErrors = errorsDetails?.filter(({ date }) => dateUtils.isTodayDate(date));
  todayErrors?.map(({ date }) => dateUtils.getHour(date));

  for (let i = 0; i <= 23; i++) {
    const currentHourErrors = todayErrors?.filter(({ date }) => dateUtils.getHour(date) === i);
    response.push({ date: formatHourToPlotAxis(i), count: currentHourErrors?.length });
  }

  const yesterdayErrors = errorsDetails.filter(({ date }) => dateUtils.isYesterdayDate(date));

  const isMore = todayErrors?.length > yesterdayErrors?.length;
  const lastError = todayErrors[todayErrors?.length - 1]?.date || null;

  return {
    data: response,
    count: todayErrors?.length,
    last: lastError,
    diff: {
      isMore,
      value: String(todayErrors?.length - yesterdayErrors?.length)
    }
  };
};

const parseExploreLogsPlotData = (startDate: number, endDate: number, logs: TraceoLog[]) => {
  const plotData: PlotData[] = [];

  let date = startDate;
  const endPlotDate = endDate;

  while (date <= endPlotDate) {
    const currentLogs = logs?.filter(({ receiveTimestamp }) => dateUtils.formatDate(receiveTimestamp, "HH:mm") === dateUtils.formatDate(date, "HH:mm"));
    plotData.push({ date, count: currentLogs?.length });
    date = dayjs.unix(date).local().add(1, "minute").unix();
  }

  const data = normalizePlotData(plotData);
  return data;
};

const parseErrorsToTodayPlotSource = (stats: ErrorDetails[]): DailyStats => {
  const response: PlotData[] = [];
  let total = 0;

  for (let i = 0; i <= 23; i++) {
    const currentErrors = stats?.filter(({ date }) => dateUtils.getHour(date) === i);
    total += currentErrors?.length;
    response.push({ date: formatHourToPlotAxis(i), count: currentErrors?.length || 0 });
  }

  return {
    data: response,
    count: total
  };
};

const formatHourToPlotAxis = (h: number): string => {
  const hour = dayjs().hour(h).get('h');

  if (hour === 0) {
    return "00:00"
  } else if (hour <= 9) {
    return `0${hour}:00`
  } else if (hour === 23) {
    return "23:59";
  } else {
    return `${h}:00`;
  }
}

export const statisticUtils = {
  parseIncidentsAnalyticsTodayPlotData,
  parseExploreLogsPlotData,
  parseIncidentsTablePlotData,
  parseErrorsToTodayPlotSource
};

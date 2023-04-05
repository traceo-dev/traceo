import dateUtils from "./date";
import { LogLevel, ErrorDetails, DailyStats, ILog } from "@traceo/types";
import dayjs from "dayjs";

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

const parseLogs = (range: [number, number], logs: ILog[]) => {
  let date = range[0];
  const endPlotDate = range[1];

  const map = new Map<LogLevel, PlotData[]>();
  const xAxis: number[] = [];

  while (date <= endPlotDate) {
    const currentLogs = logs?.filter(
      ({ precise_timestamp }) =>
        dateUtils.formatDate(precise_timestamp, "HH:mm") === dateUtils.formatDate(date, "HH:mm")
    );

    Object.values(LogLevel).map((level) => {
      const count = currentLogs.filter((log) => log.level === level).length;
      const mapLevel = map.get(level);
      if (!mapLevel) {
        map.set(level, [
          {
            date,
            count
          }
        ]);
      } else {
        mapLevel.push({
          date,
          count
        });
      }
    });

    date = dayjs.unix(date).local().add(1, "minute").unix();
    xAxis.push(date);
  }

  const result: Record<LogLevel, number[]> = {
    [LogLevel.Debug]: [],
    [LogLevel.Log]: [],
    [LogLevel.Info]: [],
    [LogLevel.Warn]: [],
    [LogLevel.Error]: []
  };

  for (const [key, value] of map.entries()) {
    result[key] = value?.map((plot) => plot.count) || [];
  }

  return {
    level: result,
    xAxis
  };
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
  const hour = dayjs().hour(h).get("h");

  if (hour === 0) {
    return "00:00";
  } else if (hour <= 9) {
    return `0${hour}:00`;
  } else if (hour === 23) {
    return "23:59";
  } else {
    return `${h}:00`;
  }
};

export const statisticUtils = {
  parseLogs,
  parseErrorsToTodayPlotSource,
  parseIncidentsAnalyticsTodayPlotData
};

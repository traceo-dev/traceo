import dateUtils from "./date";
import { ErrorDetails, DailyStats, IEvent } from "@traceo/types";
import dayjs from "dayjs";

export interface PlotData {
  date: any;
  count: number;
}
const parseTodayEvents = (events: IEvent[]) => {
  const response: PlotData[] = [];

  // for (let i = 0; i <= 23; i++) {
  //   const currentHourErrors = events?.filter(({ date }) => dateUtils.getHour(date) === i);
  //   response.push({ date: formatHourToPlotAxis(i), count: currentHourErrors?.length });
  // }

  // const lastError = events[events?.length - 1]?.date || null;

  return {
    data: response,
    count: events?.length,
    last: undefined
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
  parseErrorsToTodayPlotSource,
  parseTodayEvents
};

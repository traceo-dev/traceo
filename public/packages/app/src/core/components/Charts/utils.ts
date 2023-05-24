import dayjs from "dayjs";
import { start } from "repl";

export const normalizePlotData = (plotData: Array<{ date: number; count: number }>) => {
  return {
    x: plotData?.map((plot) => plot.date) || [],
    y: plotData?.map((plot) => plot.count) || []
  };
};

const FIVE_MINTUES = 5;
const TWENTY_FOUR_HOURS = 1440;

export const timeAxisFormatter = (value: number, from: number, to: number) => {
  const s = dayjs.unix(from);
  const e = dayjs.unix(to);

  const diffInMinutes = e.diff(s, "minutes");

  const v = dayjs.unix(value);

  if (diffInMinutes <= FIVE_MINTUES) {
    return v.format("HH:mm:ss");
  }

  if (diffInMinutes <= TWENTY_FOUR_HOURS) {
    return v.format("HH:mm");
  }

  return v.format("DD/MM");
}

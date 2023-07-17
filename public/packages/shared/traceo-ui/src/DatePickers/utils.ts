import dayjs, { Dayjs } from "dayjs";

export const validateInput = (from: Dayjs, to: Dayjs, maxTimePeriod: number) => {
  if (from.isAfter(to)) {
    return "'From' can't be after 'To'";
  }

  if (to.isBefore(from)) {
    return "'To' can't be before 'From'";
  }

  const diffInHours = Math.abs(from.diff(to, "hour"));
  if (maxTimePeriod && diffInHours > maxTimePeriod) {
    return `Data can only be loaded from ${maxTimePeriod}h range`;
  }

  return null;
};

export const parseDateTime = (value: number, format = "DD-MM-YYYY HH:mm"): string => {
  return dayjs.unix(value).format(format);
};

export const parseInputValue = (value: [number, number]): string => {
  const from = dayjs.unix(value[0]);
  const to = dayjs.unix(value[1]);

  return `${from.format("YYYY-MM-DD HH:mm")} to ${to.format("YYYY-MM-DD HH:mm")}`;
};

export const parseUnixToDate = (value: number | [number, number], range: boolean) => {
  const parser = (unix: number) => new Date(unix * 1e3);
  return !range ? parser(value[0]) : [parser(value[0]), parser(value[1])];
};

export const setTimeToUnix = (time: string, initialDate: number) => {
  // time is in HH:mm format
  const [hour, minute] = time.split(":");

  const dayJS = dayjs.unix(initialDate);
  const date = dayJS.set("hour", parseInt(hour)).set("minute", parseInt(minute));

  return date;
};

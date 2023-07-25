import dayjs, { Dayjs } from "dayjs";
import { RelativeTimeOption } from "./types";

export const validateInput = (from: Dayjs, to: Dayjs) => {
  if (from.isAfter(to)) {
    return "'From' can't be after 'To'";
  }

  if (to.isBefore(from)) {
    return "'To' can't be before 'From'";
  }

  // const diffInHours = Math.abs(from.diff(to, "hour"));
  // if (maxTimePeriod && diffInHours > maxTimePeriod) {
  //   return `Data can only be loaded from ${maxTimePeriod}h range`;
  // }

  return null;
};

export const parseDateTime = (value: number, format = "DD MMM HH:mm"): string => {
  return dayjs.unix(value).format(format);
};

export const parseInputValue = (value: [number, number]): string => {
  const from = dayjs.unix(value[0]);
  const to = dayjs.unix(value[1]);

  return `${from.format("DD MMM, HH:mm")} to ${to.format("DD MMM, HH:mm")}`;
};

export const parseUnixToDate = (value: number | [number, number], range: boolean) => {
  const parser = (unix: number) => new Date(unix * 1e3);
  return [parser(value[0]), parser(value[1])];
};

export const setTimeToUnix = (time: string, initialDate: number) => {
  // time is in HH:mm format
  const [hour, minute] = time.split(":");

  const dayJS = dayjs.unix(initialDate);
  const date = dayJS.set("hour", parseInt(hour)).set("minute", parseInt(minute));

  return date;
};

export const relativeTimeOptions: RelativeTimeOption[] = [
  {
    label: "Last 5 minutes",
    value: 5,
    unit: "minutes"
  },
  {
    label: "Last 10 minutes",
    value: 10,
    unit: "minutes"
  },
  {
    label: "Last 15 minutes",
    value: 15,
    unit: "minutes"
  },
  {
    label: "Last 30 minutes",
    value: 30,
    unit: "minutes"
  },
  {
    label: "Last 1 hour",
    value: 60,
    unit: "minutes"
  },
  {
    label: "Last 2 hours",
    value: 60 * 2,
    unit: "minutes"
  },
  {
    label: "Last 3 hours",
    value: 60 * 3,
    unit: "minutes"
  },
  {
    label: "Last 6 hours",
    value: 60 * 6,
    unit: "minutes"
  },
  {
    label: "Last 12 hours",
    value: 60 * 12,
    unit: "minutes"
  },
  {
    label: "Today",
    value: 60 * 24,
    unit: "minutes"
  },
  {
    label: "Last 2 days",
    value: 60 * 24 * 2,
    unit: "minutes"
  },
  {
    label: "Last 3 days",
    value: 60 * 24 * 3,
    unit: "minutes"
  },
  {
    label: "Last 5 days",
    value: 60 * 24 * 5,
    unit: "minutes"
  },
  {
    label: "Last 7 days",
    value: 60 * 24 * 7,
    unit: "minutes"
  },
  {
    label: "Last 2 weeks",
    value: 60 * 24 * 14,
    unit: "minutes"
  },
  {
    label: "Last month",
    value: 60 * 24 * 30,
    unit: "minutes"
  }
];

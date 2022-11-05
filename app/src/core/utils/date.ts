import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(isYesterday);
dayjs.extend(isToday);

const guessTimezone = dayjs.tz.guess();

const toUnix = (date: string | Date = new Date()) => dayjs(date).unix();

const formatDate = (date: number, format = "DD-MM-YYYY") =>
  dayjs.unix(date).tz().format(format);

const mapMonthName: Record<number, string> = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec"
};

const formatDateTime = (date: number) => {
  const time = dayjs.unix(date).tz(guessTimezone);

  if (dayjs.unix(date).isToday()) {
    return time.format("HH:mm");
  } else if (dayjs.unix(date).isYesterday()) {
    return "Yesterday at " + time.format("HH:mm");
  } else {
    const day = time.format("DD");
    const month = mapMonthName[time.month() + 1];
    const timeFormat = time.format("HH:mm");

    return `${day} ${month} at ${timeFormat}`;
  }
};

const getNow = (format = "DD-MM-YYYY HH:mm") => formatDate(toUnix(), format);
const getMonth = (date: number = toUnix()) => dayjs.unix(date).month();
const getYear = (date: number = toUnix()) => dayjs.unix(date).year();
const getDayInUnix = (date = dayjs()) => dayjs(date).startOf("day").unix();
const fromNow = (date: number) => dayjs.unix(date).fromNow();
const isTodayDate = (date: number) => dayjs.unix(date).isToday();

const isRecentComment = (date: number) => {
  const maxDate = dayjs.unix(date).add(1, "minute").unix();
  const result = dayjs(toUnix()).isBefore(maxDate);

  return result;
};

const dateUtils = {
  toUnix,
  formatDate,
  getMonth,
  getYear,
  getDayInUnix,
  fromNow,
  formatDateTime,
  getNow,
  isTodayDate,
  isRecentComment
};

export default dateUtils;

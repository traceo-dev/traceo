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

const guessTz = () => dayjs.tz.guess();
const toUnix = (date: string | Date = new Date()) => dayjs(date).local().unix();

const formatDate = (date: number, format = "DD-MM-YYYY") =>
  date ? dayjs.unix(date).local().format(format) : "--:--";

const fromNow = (date: number) => date ? dayjs.unix(date).local().fromNow() : "--:--";

const isTodayDate = (date: number) => dayjs.unix(date).local().isToday();
const isYesterdayDate = (date: number) => dayjs.unix(date).local().isYesterday();

const isRecentComment = (date: number) => {
  const maxDate = dayjs.unix(date).add(1, "minute").unix();
  return dayjs(toUnix()).isBefore(maxDate);
};
const getHour = (date: number = toUnix()) => dayjs.unix(date).local().hour();
const endOf = (date: number = toUnix(), unit: dayjs.OpUnitType = "day") => dayjs.unix(date).endOf(unit).unix();

const dateUtils = {
  toUnix,
  formatDate,
  fromNow,
  isTodayDate,
  isYesterdayDate,
  isRecentComment,
  guessTz,
  getHour,
  endOf
};

export default dateUtils;

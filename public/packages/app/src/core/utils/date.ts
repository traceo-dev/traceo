import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(isYesterday);
dayjs.extend(isToday);

const guessTz = () => dayjs.tz.guess();
const toUnix = (date: string | Date = new Date()) => dayjs(date).local().unix();

const formatDate = (date: number, format = "DD-MM-YYYY") =>
  date ? dayjs.unix(date).local().format(format) : "--:--";

const fromNow = (date: number) => (date ? dayjs.unix(date).local().fromNow() : "--:--");

const isTodayDate = (date: number) => dayjs.unix(date).local().isToday();
const isYesterdayDate = (date: number) => dayjs.unix(date).local().isYesterday();

const getHour = (date: number = toUnix()) => dayjs.unix(date).local().hour();
const endOf = (date: number = toUnix(), unit: dayjs.OpUnitType = "day") =>
  dayjs.unix(date).endOf(unit).unix();

const formatToMs = (unix: number, format = "YYYY-MM-DD HH:mm:ss.SSS") => {
  return dateUtils.formatDate(unix / 1000, format);
};

const dateUtils = {
  toUnix,
  formatDate,
  formatToMs,
  fromNow,
  isTodayDate,
  isYesterdayDate,
  guessTz,
  getHour,
  endOf
};

export default dateUtils;

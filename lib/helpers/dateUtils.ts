import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isToday from "dayjs/plugin/isToday";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(isBetween);
dayjs.extend(isTomorrow)
dayjs.extend(isToday)
dayjs.extend(timezone);

type UnitType = 'd' | 'D' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms';

const toUnix = (date: string | Date = new Date()) => dayjs(date).unix();
const formatDate = (date: number, format = "DD-MM-YYYY") =>
  dayjs.unix(date).format(format);
const getMonth = (date: number = toUnix()) => dayjs.unix(date).month();
const getYear = (date: number = toUnix()) => dayjs.unix(date).year();
const getHour = (date: number = toUnix()) => dayjs.unix(date).hour();
const getDayInUnix = (date = dayjs()) => dayjs(date).startOf("day").unix();
const getEndOf = (date: number = toUnix(), unit: UnitType = "d") => dayjs.unix(date).endOf(unit);
const getStartOf = (date: number = toUnix(), unit: UnitType = "h") => dayjs.unix(date).startOf(unit);

const dateUtils = {
  toUnix,
  formatDate,
  getMonth,
  getYear,
  getHour,
  getEndOf,
  getStartOf,
  getDayInUnix,
};

export default dateUtils;

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isToday from "dayjs/plugin/isToday";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(isBetween);
dayjs.extend(isTomorrow)
dayjs.extend(isToday)
dayjs.extend(timezone);
dayjs.extend(utc)

type UnitType = 'd' | 'D' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms';

const toUnix = (date: string | Date = new Date()) => dayjs(date).utc().unix();
const formatDate = (date: number, format = "DD-MM-YYYY") =>
  dayjs.unix(date).utc().format(format);
const getMonth = (date: number = toUnix()) => dayjs.unix(date).utc().month();
const getYear = (date: number = toUnix()) => dayjs.unix(date).utc().year();
const getHour = (date: number = toUnix()) => dayjs.unix(date).utc().hour();
const getDayInUnix = (date = dayjs()) => dayjs(date).startOf("day").utc().unix();
const getEndOf = (date: number = toUnix(), unit: UnitType = "d") => dayjs.unix(date).utc().endOf(unit);
const getStartOf = (date: number = toUnix(), unit: UnitType = "h") => dayjs.unix(date).utc().startOf(unit);

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

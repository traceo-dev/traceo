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

const toUnix = (date: string | Date = new Date()) => dayjs(date).unix();
const getLocalTime = (date: string | Date = new Date()) => dayjs(date).local().unix();
const formatDate = (date: number, format = "DD-MM-YYYY") =>
  dayjs.unix(date).local().format(format);


const formatDateTime = (date: number) => {
  const time = dayjs.unix(date).local();

  if (dayjs.unix(date).isToday()) {
    return time.format("HH:mm");
  } else if (dayjs.unix(date).isYesterday()) {
    return "Yesterday at " + time.format("HH:mm");
  } else return `${time.format("DD MMM")} at ${time.format("HH:mm")}`;
};

const getNow = (format = "DD-MM-YYYY HH:mm") => formatDate(getLocalTime(), format);
const getMonth = (date: number = toUnix()) => dayjs.unix(date).month();
const getYear = (date: number = toUnix()) => dayjs.unix(date).year();
const getDayInUnix = (date = dayjs()) => dayjs(date).startOf("day").unix();
const fromNow = (date: number) => dayjs.unix(date).fromNow();
const isTodayDate = (date: number) => dayjs.unix(date).isToday();

const isRecentComment = (date: number) => {
  const maxDate = dayjs.unix(date).add(1, "minute").unix();
  return dayjs(toUnix()).isBefore(maxDate);
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

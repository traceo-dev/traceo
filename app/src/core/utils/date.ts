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

const formatDate = (date: number, format = "DD-MM-YYYY") =>
  date ? dayjs.unix(date).utc().format(format) : "--:--";

const fromNow = (date: number) => date ? dayjs.unix(date).fromNow() : "--:--";

const isTodayDate = (date: number) => dayjs.unix(date).isToday();

const isRecentComment = (date: number) => {
  const maxDate = dayjs.unix(date).add(1, "minute").unix();
  return dayjs(toUnix()).isBefore(maxDate);
};

const dateUtils = {
  toUnix,
  formatDate,
  fromNow,
  isTodayDate,
  isRecentComment
};

export default dateUtils;

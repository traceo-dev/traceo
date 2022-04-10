import dayjs from "dayjs";

const toUnix = (date: string | Date = new Date()) => dayjs(date).unix();
const formatDate = (date: number, format = "DD-MM-YYYY") =>
  dayjs.unix(date).format(format);
const getMonth = (date: number = toUnix()) => dayjs.unix(date).month();
const getYear = (date: number = toUnix()) => dayjs.unix(date).year();
const getDayInUnix = (date = dayjs()) => dayjs(date).startOf("day").unix();

const dateUtils = {
  toUnix,
  formatDate,
  getMonth,
  getYear,
  getDayInUnix,
};

export default dateUtils;

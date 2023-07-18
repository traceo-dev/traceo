import dayjs from "dayjs";

/**
 * Function to calculate intervals for queries in clickhouse.
 * For every 6h of difference between {to} and {from} there is added 10 seconds to interval.
 * 
 * eq. 
 *  5h diff -> 10s
 *  6h diff -> 10s
 *  7h diff -> 10s
 *  12h diff -> 20s
 *  18h diff -> 30s
 *  24h diff -> 40s
 * 
 * In case when difference is less than one hour then interval is 5 second.
 * 
 * @returns value in seconds
 */
export const calculateInterval = (query: { from: number; to: number }) => {
  const { from, to } = query;
  const hoursDiff = dayjs.unix(to).diff(dayjs.unix(from), "hours");

  if (hoursDiff <= 0) {
    return 5;
  }

  const interval = Math.floor(hoursDiff / 6);
  const result = Math.floor((interval > 0 ? interval : 1) * 10);

  return result;
};

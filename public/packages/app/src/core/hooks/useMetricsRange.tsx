import dayjs from "dayjs";
import { useState } from "react";
import dateUtils from "../utils/date";

export const useMetricsRange = () => {
  const [ranges, setRanges] = useState<[number, number]>([
    dayjs.unix(dateUtils.toUnix()).subtract(1, "d").unix(),
    dateUtils.toUnix()
  ]);

  return { ranges, setRanges };
};

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dateUtils from "../utils/date";

export const useMetricsRange = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const from = Number(searchParams.get("from"));
  const to = Number(searchParams.get("to"));

  const [ranges, setRanges] = useState<[number, number]>([
    from || dayjs.unix(dateUtils.toUnix()).subtract(1, "d").unix(),
    to || dateUtils.toUnix()
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("from", ranges[0].toString());
    params.set("to", ranges[1].toString());
    const rangeParams = searchParams.toString();

    navigate(`${location.pathname}?${rangeParams}`);
  }, [ranges]);

  return { ranges, setRanges };
};

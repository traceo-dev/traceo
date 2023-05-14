import { useEffect, useState } from "react";
import { timeService } from "../lib/time";
import historyService from "../lib/history";

type RangeType = [number, number];

export const useTimeRange = (initial?: { from: number; to: number }, initOnStart = true) => {
  const searchParams = new URLSearchParams(window.location.search);
  const [ranges, setRanges] = useState<RangeType>([
    parseInt(searchParams.get("from")) || initial?.from,
    parseInt(searchParams.get("to")) || initial?.to
  ]);

  useEffect(() => {
    if (!initOnStart) {
      return;
    }

    const unlisten = historyService.listen(({ action, location }) => {
      if (action === "POP") {
        const search = new URLSearchParams(location.search);
        if (search.get("from") && search.get("to")) {
          setRanges([parseInt(search.get("from")), parseInt(search.get("to"))]);
        }
      }
    });

    return () => {
      unlisten();
    };
  }, []);

  useEffect(() => {
    if (!initOnStart) {
      return;
    }

    timeService.setParams({
      from: ranges[0],
      to: ranges[1]
    });
  }, [ranges]);

  return { ranges, setRanges };
};

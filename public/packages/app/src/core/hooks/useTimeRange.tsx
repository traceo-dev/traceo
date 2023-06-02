import { useEffect, useState } from "react";
import { urlService } from "../lib/url";
import historyService from "../lib/history";
import { TimeRange } from "@traceo/types";

export const useTimeRange = (initial?: { from: number; to: number }, initOnStart = true) => {
  const searchParams = new URLSearchParams(window.location.search);
  const [ranges, setRanges] = useState<TimeRange>([
    parseInt(searchParams.get("from")) || initial?.from,
    parseInt(searchParams.get("to")) || initial?.to
  ]);

  useEffect(() => {
    if (!initOnStart) {
      return;
    }

    urlService.setParams({
      from: ranges[0],
      to: ranges[1]
    });
  }, [ranges]);

  return { ranges, setRanges };
};

import { TimeRangePicker } from "@traceo/ui";
import { useEffect, useState } from "react";
import { localStorageService } from "src/core/lib/localStorage";
import { LocalStorage } from "src/core/lib/localStorage/types";

interface Props {
  ranges: [number, number];
  setRanges: (val: [number, number]) => void;
}
export const MetricTimeRangePicker = ({ ranges, setRanges }: Props) => {
  const [newRanges, setNewRanges] = useState<[number, number]>(ranges);

  useEffect(() => {
    localStorageService.set(LocalStorage.MetricQuery, {
      from: newRanges[0],
      to: newRanges[1]
    });
  }, [newRanges]);

  return (
    <TimeRangePicker
      value={newRanges}
      onChange={(from, to) => setNewRanges([from, to])}
      submit={() => setRanges(newRanges)}
    />
  );
};

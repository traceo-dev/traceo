import { DatesRangePicker } from "@traceo/ui";
import { useState } from "react";

interface Props {
  ranges: [number, number];
  setRanges: (val: [number, number]) => void;
}
export const MetricTimeRangePicker = ({ ranges, setRanges }: Props) => {
  const [newRanges, setNewRanges] = useState<[number, number]>(ranges);

  return (
    <DatesRangePicker
      value={newRanges}
      onChange={(from, to) => setNewRanges([from, to])}
      submit={() => setRanges(newRanges)}
    />
  );
};

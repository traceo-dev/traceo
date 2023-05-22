import { TimeRangePicker } from "@traceo/ui";
import { EXPLORE_TYPE } from "../types";
import { Setter } from "@traceo/types";
import dayjs from "dayjs";
import { relativeTimeOptions } from "./utils";

interface Props {
  type: EXPLORE_TYPE;
  range: [number, number];
  setRange: Setter<[number, number]>;
  maxRange?: number;
}

const MAX_DATE = new Date(dayjs().unix() * 1e3);

export const ExploreRangePicker = ({ range, setRange, maxRange = 24 }: Props) => {
  return (
    <TimeRangePicker
      value={range}
      options={relativeTimeOptions}
      submit={(val: [number, number]) => setRange(val)}
      maxHourPeriod={maxRange}
      datesRange={true}
      maxDate={MAX_DATE}
    />
  );
};

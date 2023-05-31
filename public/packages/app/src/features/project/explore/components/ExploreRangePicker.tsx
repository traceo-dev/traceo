import { TimeRangePicker } from "@traceo/ui";
import { EXPLORE_TYPE, Setter, TimeRange } from "@traceo/types";
import dayjs from "dayjs";
import { relativeTimeOptions } from "./utils";

interface Props {
  type: EXPLORE_TYPE;
  range: TimeRange;
  setRange: Setter<TimeRange>;
  maxRange?: number;
}

const MAX_DATE = new Date(dayjs().unix() * 1e3);

export const ExploreRangePicker = ({ range, setRange, maxRange = 24 }: Props) => {
  return (
    <TimeRangePicker
      value={range}
      options={relativeTimeOptions}
      submit={(val: TimeRange) => setRange(val)}
      maxHourPeriod={maxRange}
      datesRange={true}
      maxDate={MAX_DATE}
      type="secondary"
    />
  );
};

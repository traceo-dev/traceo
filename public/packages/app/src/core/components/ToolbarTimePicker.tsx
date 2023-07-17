import { Setter, TimeRange } from "@traceo/types";
import { TimeRangePicker } from "@traceo/ui";
import dayjs from "dayjs";
import { relativeTimeOptions } from "../../features/project/explore/components/utils";

const MAX_DATE = new Date(dayjs().unix() * 1e3);

interface Props {
  ranges: TimeRange;
  onChangeRanges: Setter<TimeRange>;
}

export const ToolbarTimePicker = ({ onChangeRanges, ranges }: Props) => {
  return (
    <TimeRangePicker
      value={ranges}
      options={relativeTimeOptions}
      submit={(val: TimeRange) => onChangeRanges(val)}
      datesRange={true}
      maxDate={MAX_DATE}
      type="secondary"
      className="bg-secondary border-none text-xs font-semibold hover:ring-0 hover:ring-transparent hover:text-white hover:bg-light-secondary"
    />
  );
};

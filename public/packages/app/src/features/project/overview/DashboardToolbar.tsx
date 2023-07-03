import { Setter, TimeRange } from "@traceo/types";
import { Row, TimeRangePicker } from "@traceo/ui";
import dayjs from "dayjs";
import { relativeTimeOptions } from "../explore/components/utils";
import { SwitchDashboardPopover } from "./components/SwitchDashboardPopover";

const MAX_DATE = new Date(dayjs().unix() * 1e3);

interface Props {
  showTimepicker?: boolean;
  ranges: TimeRange;
  onChangeRanges: Setter<TimeRange>;
  isRemoveMode: boolean;
  setRemoveMode: Setter<boolean>;
}
export const DashboardToolbar = ({
  showTimepicker = true,
  ranges = [undefined, undefined],
  onChangeRanges = undefined,
  isRemoveMode = false,
  setRemoveMode = undefined
}: Props) => {
  return (
    <Row className="justify-between mb-2">
      <SwitchDashboardPopover isRemoveMode={isRemoveMode} setRemoveMode={setRemoveMode} />
      {showTimepicker && (
        <TimeRangePicker
          value={ranges}
          options={relativeTimeOptions}
          submit={(val: TimeRange) => onChangeRanges(val)}
          datesRange={true}
          maxDate={MAX_DATE}
          type="secondary"
        />
      )}
    </Row>
  );
};

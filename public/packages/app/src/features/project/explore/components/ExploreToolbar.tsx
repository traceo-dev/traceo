import { CaretRightFilled, LoadingOutlined } from "@ant-design/icons";
import { Setter, TimeRange } from "@traceo/types";
import { Row, TimeRangePicker, joinClasses } from "@traceo/ui";
import { Portal } from "../../../../core/components/Portal";
import { ToolbarButton } from "../../overview/components/Toolbars/ToolbarButton";
import dayjs from "dayjs";

const MAX_DATE = new Date(dayjs().unix() * 1e3);

interface Props {
  ranges: TimeRange;
  setRanges: Setter<TimeRange>;
  loading: boolean;
  onClickSearch: () => void;
}
export const ExploreToolbar = ({ loading = false, onClickSearch, ranges, setRanges }: Props) => {
  const btnStyle = loading ? "bg-error" : "bg-blue-500 hover:bg-blue-600 transition duration-100";
  return (
    <Portal id="dashboard-toolbar">
      <Row gap="x-3" className="text-sm">
        <TimeRangePicker
          value={ranges}
          submit={(val: TimeRange) => setRanges(val)}
          maxDate={MAX_DATE}
          type="secondary"
        />
        <ToolbarButton
          icon={!loading ? <CaretRightFilled /> : <LoadingOutlined />}
          name="Run"
          className={joinClasses("text-white", btnStyle)}
          onClick={() => onClickSearch()}
        />
      </Row>
    </Portal>
  );
};

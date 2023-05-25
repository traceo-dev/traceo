import { RelativeTimeOption, TimeRangePicker } from "@traceo/ui";
import dayjs from "dayjs";

interface Props {
  isDisabled?: boolean;
  ranges: [number, number];
  setRanges: (val: [number, number]) => void;
}

const relativeTimeOptions: RelativeTimeOption[] = [
  {
    label: "Last 30 minutes",
    unit: "minute",
    value: 30
  },
  {
    label: "Last 60 minutes",
    unit: "minute",
    value: 60
  },
  {
    label: "Last 2 hours",
    unit: "hour",
    value: 2
  },
  {
    label: "Last 3 hours",
    unit: "hour",
    value: 3
  },
  {
    label: "Last 6 hours",
    unit: "hour",
    value: 6
  },
  {
    label: "Last 12 hours",
    unit: "hour",
    value: 12
  },
  {
    label: "Last 24 hours",
    unit: "hour",
    value: 24
  },
  {
    label: "Last 2 days",
    unit: "day",
    value: 2
  },
  {
    label: "Last 3 days",
    unit: "day",
    value: 3
  },
  {
    label: "Last 5 days",
    unit: "day",
    value: 5
  },
  {
    label: "Last 7 days",
    unit: "day",
    value: 7
  },
  {
    label: "Last 14 days",
    unit: "day",
    value: 14
  },
  {
    label: "Last month",
    unit: "month",
    value: 1
  },
  {
    label: "Last 2 months",
    unit: "month",
    value: 2
  },
  {
    label: "Last 3 months",
    unit: "month",
    value: 3
  },
  {
    label: "Last 6 months",
    unit: "month",
    value: 6
  },
  {
    label: "Last 12 months",
    unit: "month",
    value: 12
  }
];

const MAX_DATE = new Date(dayjs().unix() * 1e3);
export const MetricTimeRangePicker = ({ ranges, setRanges, isDisabled = false }: Props) => (
  <TimeRangePicker
    disabled={isDisabled}
    datesRange={true}
    value={ranges}
    options={relativeTimeOptions}
    submit={(val: [number, number]) => setRanges(val)}
    maxDate={MAX_DATE}
  />
);

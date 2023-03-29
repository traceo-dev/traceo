import { RelativeTimeOption, TimeRangePicker } from "@traceo/ui";

interface Props {
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
  }
];

export const MetricTimeRangePicker = ({ ranges, setRanges }: Props) => (
  <TimeRangePicker
    datesRange={true}
    value={ranges}
    options={relativeTimeOptions}
    submit={(val: [number, number]) => setRanges(val)}
  />
);

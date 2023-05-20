import {
  InfoCircleOutlined,
  BugOutlined,
  ExclamationCircleOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { LogLevel } from "@traceo/types";
import { RelativeTimeOption } from "@traceo/ui";

export const mapLogName: Record<LogLevel, string> = {
  [LogLevel.Log]: "Log",
  [LogLevel.Debug]: "Debug",
  [LogLevel.Info]: "Info",
  [LogLevel.Error]: "Error",
  [LogLevel.Warn]: "Warn"
};

export const mapLogBarsColor: Record<LogLevel, string> = {
  [LogLevel.Log]: "#2b6cb0",
  [LogLevel.Debug]: "#f6993f",
  [LogLevel.Info]: "#176537",
  [LogLevel.Error]: "#e53e3e",
  [LogLevel.Warn]: "#F7DF4B"
};

export const commonSeriesOptions = {
  type: "bar",
  stack: "Ad",
  itemStyle: {
    // borderColor: "transparent",
    // borderWidth: 2,
    // borderRadius: 2
  }
};

export const mapLogIcon: Record<LogLevel, JSX.Element> = {
  [LogLevel.Info]: <InfoCircleOutlined className="text-green-500" />,
  [LogLevel.Debug]: <BugOutlined className="text-amber-500" />,
  [LogLevel.Error]: <ExclamationCircleOutlined className="text-red-500" />,
  [LogLevel.Warn]: <WarningOutlined className="text-yellow-500" />,
  [LogLevel.Log]: <InfoCircleOutlined className="text-blue-500" />
};

export const mapLogColor: Record<LogLevel, string> = {
  [LogLevel.Info]: "text-green-500",
  [LogLevel.Debug]: "text-amber-500",
  [LogLevel.Error]: "text-red-500",
  [LogLevel.Warn]: "text-yellow-500",
  [LogLevel.Log]: "text-blue-500"
};

export const relativeTimeOptions: RelativeTimeOption[] = [
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
    label: "Last 7 days",
    unit: "day",
    value: 7
  }
];

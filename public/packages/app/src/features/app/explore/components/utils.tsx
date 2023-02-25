import {
  InfoCircleOutlined,
  BugOutlined,
  ExclamationCircleOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { LogLevel } from "@traceo/types";

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

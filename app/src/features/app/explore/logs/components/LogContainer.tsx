import {
  InfoCircleOutlined,
  BugOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  DownOutlined,
  RightOutlined
} from "@ant-design/icons";
import { Space } from "antd";
import { joinClasses, conditionClass } from "../../../../../core/utils/classes";
import { FC, useState } from "react";
import { LogLevel, TraceoLog } from "../../../../../types/logs";
import { Typography } from "core/ui-components/Typography/Typography";

export const handleLogIcon: Record<LogLevel, JSX.Element> = {
  [LogLevel.Info]: <InfoCircleOutlined className="text-blue-500" />,
  [LogLevel.Debug]: <BugOutlined className="text-amber-500" />,
  [LogLevel.Error]: <ExclamationCircleOutlined className="text-red-500" />,
  [LogLevel.Warn]: <WarningOutlined className="text-yellow-500" />,
  [LogLevel.Log]: <InfoCircleOutlined className="text-blue-500" />
};

export const LogContainer = ({ children }) => {
  return (
    <table className="w-full">
      <tbody className="block overflow-y-scroll h-96">{children}</tbody>
    </table>
  );
};

interface LogProps {
  log: TraceoLog;
}
export const LogRow: FC<LogProps> = ({ log }) => {
  const [isSelected, setSelected] = useState<boolean>(false);

  return (
    <>
      <tr
        className={joinClasses(
          "grid grid-cols-12 font-mono text-xs py-1 block cursor-pointer hover:bg-secondary",
          conditionClass(isSelected, "bg-secondary")
        )}
        onClick={() => setSelected(!isSelected)}
      >
        <td className="col-span-1">
          {isSelected ? <DownOutlined /> : <RightOutlined />}
          <Typography className="ml-4">{handleLogIcon[log.level]}</Typography>
        </td>
        <td className="col-span-2">{log.timestamp}</td>
        <td className="col-span-7">
          {
            <span className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
              {log.message}
            </span>
          }
        </td>
      </tr>
      {isSelected && (
        <Space
          direction="vertical"
          style={{
            border: "1px solid #2a2d32"
          }}
          className="text-xs p-3 w-full rounded-md"
        >
          <pre className="whitespace-pre-wrap">{JSON.stringify(log, null, 2)}</pre>
        </Space>
      )}
    </>
  );
};

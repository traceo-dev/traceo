import {
  InfoCircleOutlined,
  BugOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  DownOutlined,
  RightOutlined
} from "@ant-design/icons";
import { Space, Typography } from "@traceo/ui";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { FC, useState } from "react";
import { LogLevel, TraceoLog } from "@traceo/types";

export const mapLogIcon: Record<LogLevel, JSX.Element> = {
  [LogLevel.Info]: <InfoCircleOutlined className="text-blue-500" />,
  [LogLevel.Debug]: <BugOutlined className="text-amber-500" />,
  [LogLevel.Error]: <ExclamationCircleOutlined className="text-red-500" />,
  [LogLevel.Warn]: <WarningOutlined className="text-yellow-500" />,
  [LogLevel.Log]: <InfoCircleOutlined className="text-blue-500" />
};

export const LogContainer = ({ children }) => {
  return <ul className="w-full block overflow-y-scroll h-96 pl-0">{children}</ul>;
};

interface LogProps {
  log: TraceoLog;
}
export const LogRow: FC<LogProps> = ({ log }) => {
  const [isSelected, setSelected] = useState<boolean>(false);

  return (
    <>
      <li
        className={joinClasses(
          "grid grid-cols-12 font-mono text-xs py-1 block cursor-pointer hover:bg-secondary",
          conditionClass(isSelected, "bg-secondary")
        )}
        onClick={() => setSelected(!isSelected)}
      >
        <span className="col-span-1">
          {isSelected ? <DownOutlined /> : <RightOutlined />}
          <Typography className="ml-4">{mapLogIcon[log.level]}</Typography>
        </span>
        <span className="col-span-2">{log.timestamp}</span>
        <span className="col-span-7">
          <div className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
            {log.message}
          </div>
        </span>
      </li>
      {isSelected && (
        <Space
          direction="vertical"
          className="text-xs p-3 w-full rounded-md border border-solid border-light-secondary"
        >
          <pre className="whitespace-pre-wrap">{JSON.stringify(log, null, 2)}</pre>
        </Space>
      )}
    </>
  );
};

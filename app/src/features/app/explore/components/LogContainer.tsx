import {
  InfoCircleOutlined,
  BugOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  DownOutlined,
  RightOutlined
} from "@ant-design/icons";
import { Space } from "antd";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { FC, useState } from "react";
import { TraceoLog, LogLevel } from "../../../../types/logs";

export const handleLogIcon: Record<LogLevel, JSX.Element> = {
  [LogLevel.Info]: <InfoCircleOutlined className="text-blue-500" />,
  [LogLevel.Debug]: <BugOutlined className="text-amber-500" />,
  [LogLevel.Error]: <ExclamationCircleOutlined className="text-red-500" />,
  [LogLevel.Warn]: <WarningOutlined className="text-yellow-500" />,
  [LogLevel.Log]: <InfoCircleOutlined className="text-blue-500" />
};

export const LogContainer = ({ children }) => {
  return (
    <>
      <table>
        <tbody className="logs-tbody">{children}</tbody>
      </table>
      <style>{`
          table {
              width: 100%;
          }
          .logs-tbody {
              height: 450px;
              overflow-y:scroll;
              display:block
          }
      `}</style>
    </>
  );
};

interface LogProps {
  log: TraceoLog;
}
export const LogRow: FC<LogProps> = ({ log }) => {
  const [isSelected, setSelected] = useState<boolean>(false);

  const expandIcon = isSelected ? <DownOutlined /> : <RightOutlined />;

  return (
    <>
      <tr
        className={joinClasses("log-tr", conditionClass(isSelected, "bg-secondary"))}
        onClick={() => setSelected(!isSelected)}
      >
        <td className="log-expand">{expandIcon}</td>
        <td className="log-level">{handleLogIcon[log.level]}</td>
        <td className="log-timestamp">{log.timestamp}</td>
        <td className="log-message">{<span className="msg">{log.message}</span>}</td>
      </tr>
      {isSelected && (
        <Space className="log-details" direction="vertical">
          <pre className="whitespace-pre-wrap">{JSON.stringify(log, null, 2)}</pre>
        </Space>
      )}

      <style>{`
          .msg {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
          }
          .log-details {
              padding: 9px;
              font-size: 12px;
              width: 100%;
              border: 1px solid #2a2d32;
            border-radius: 4px;
          }
          .log-tr {
              cursor: pointer;  
              font-family: monospace;
              font-size: 12px;
              display: block;
          }
  
          .log-tr:hover {
              background-color: var(--color-bg-secondary)
          }
          .log-expand {
              width: 40px;
          }
  
          .log-level {
              width: 40px;
          }
  
          .log-timestamp {
              width: 200px;
              font-family: monospace;
              font-size: 12px;
          }
        `}</style>
    </>
  );
};

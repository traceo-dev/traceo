import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { ILog, LogLevel } from "@traceo/types";
import { Col, conditionClass, joinClasses } from "@traceo/ui";
import { useState } from "react";
import styled from "styled-components";
import { LogDetailsForm } from "./LogDetailsForm";
import dateUtils from "../../../../core/utils/date";

const LogItem = styled.tr<{
  level: LogLevel;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  align-items: center;
  padding-bottom: 0.15rem;
  padding-top: 0.15rem;
  line-height: 1rem;
  border-left: 3px solid;
  padding-left: 6px;
  border-color: #3B82F5;
  margin-bottom: 2px;

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  ${(p) => p.isSelected && `background-color: var(--color-bg-secondary)`}
`;

interface Props {
  log: ILog;
  showTime: boolean;
  verboseLog: boolean;
}

export const LogRow = ({ log, showTime = true, verboseLog = true }: Props) => {
  const [isCollapsed, setCollapsed] = useState<boolean>(true);

  return (
    <Col>
      <LogItem isSelected={!isCollapsed} onClick={() => setCollapsed(!isCollapsed)}>
        <td className="text-[8px] pr-5">{isCollapsed ? <RightOutlined /> : <DownOutlined />}</td>
        {showTime && (
          <td className="pr-5 whitespace-nowrap">
            {dateUtils.formatToMs(log.precise_timestamp)}
          </td>
        )}
        <td
          className={joinClasses(
            conditionClass(
              verboseLog,
              "whitespace-wrap",
              "whitespace-nowrap overflow-hidden text-ellipsis inline-block"
            )
          )}
        >
          <span>{log.message}</span>
        </td>
      </LogItem>
      {!isCollapsed && <LogDetailsForm {...log} />}
    </Col>
  );
};

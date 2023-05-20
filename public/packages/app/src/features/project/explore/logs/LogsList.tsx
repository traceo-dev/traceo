import {
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RightOutlined
} from "@ant-design/icons";
import { LogLevel, ILog } from "@traceo/types";
import { Card, Space, Tooltip } from "@traceo/ui";
import { useState } from "react";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { Descriptions, DescriptionRow } from "../../../../core/components/Descriptions";
import { mapLogBarsColor, mapLogColor } from "../components/utils";
import styled from "styled-components";

export const LogsList = ({ logs }: { logs: ILog[] }) => (
  <ConditionalWrapper
    emptyView={<DataNotFound label="Logs not found" />}
    isEmpty={logs?.length === 0}
  >
    <ul className="w-full block overflow-y-scroll max-h-[780px] pl-0">
      {logs?.map((log, index) => (
        <LogRow key={index} {...log} />
      ))}
    </ul>
  </ConditionalWrapper>
);

const LogRow = (log: ILog) => {
  const [isSelected, setSelected] = useState<boolean>(false);

  const toggleIcon = (is: boolean) => (is ? <DownOutlined /> : <RightOutlined />);

  return (
    <div>
      <LogWrapper
        level={log.level}
        isSelected={isSelected}
        onClick={() => setSelected(!isSelected)}
      >
        <span className="col-span-2">
          <span className="p-1 rounded text-[8px]">{toggleIcon(isSelected)}</span>
          <span className="pl-2 whitespace-nowrap">{log.timestamp}</span>
        </span>
        <span className="col-span-10">
          <div className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
            {log.message}
          </div>
        </span>
      </LogWrapper>
      {isSelected && (
        <Space
          direction="vertical"
          className="text-xs p-3 w-full rounded-md border border-solid border-light-secondary bg-primary"
        >
          <Descriptions>
            <DescriptionRow label="Message">{log.message}</DescriptionRow>
            <DescriptionRow label="Timestamp">{log.timestamp}</DescriptionRow>
            <DescriptionRow label="Level">{log.level}</DescriptionRow>
          </Descriptions>
        </Space>
      )}
    </div>
  );
};

const LogWrapper = styled.li<{
  level: LogLevel;
}>`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  align-items: center;
  padding-bottom: 0.15rem;
  padding-top: 0.15rem;
  line-height: 1rem;
  border-left: 3px solid;
  padding-left: 12px;

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  ${(p) => p.level && `border-color: ${mapLogBarsColor[p.level]};`}
  ${(p) => p.isSelected && `background-color: var(--color-bg-secondary)`}
`;

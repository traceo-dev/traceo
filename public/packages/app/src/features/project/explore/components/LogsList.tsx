import { MinusOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { LogLevel, ILog } from "@traceo/types";
import { Card, Space, Tooltip } from "@traceo/ui";
import { useState } from "react";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { Descriptions, DescriptionRow } from "../../../../core/components/Descriptions";
import { mapLogBarsColor, mapLogColor } from "./utils";
import styled from "styled-components";

export const LogsList = ({ logs, isLoading }: { logs: ILog[]; isLoading: boolean }) => (
  <Card
    title="Logs list"
    bodyClassName="m-0 p-0"
    extra={
      <div className="flex flex-row gap-x-3 items-center">
        <Tooltip title="At the moment, Traceo Platform has support for fetching only 1000 logs per request. For this reason, you may need to set filters with more details, such as occurrence time and log level in histogram legend to find your log.">
          <QuestionCircleOutlined />
        </Tooltip>

        <span className="text-xs whitespace-nowrap">
          <b>{logs.length}</b> logs fetched
        </span>
      </div>
    }
  >
    <ConditionalWrapper
      emptyView={<DataNotFound label="Logs not found" />}
      isEmpty={!isLoading && logs?.length === 0}
      isLoading={isLoading}
    >
      <ul className="w-full block overflow-y-scroll h-80 pl-0">
        {logs?.map((log, index) => (
          <LogRow key={index} {...log} />
        ))}
      </ul>
    </ConditionalWrapper>
  </Card>
);

const LogRow = (log: ILog) => {
  const [isSelected, setSelected] = useState<boolean>(false);

  const toggleIcon = (is: boolean) =>
    is ? (
      <MinusOutlined className="p-1 bg-secondary rounded" />
    ) : (
      <PlusOutlined className="p-1 bg-secondary rounded" />
    );

  return (
    <div>
      <LogWrapper
        level={log.level}
        isSelected={isSelected}
        onClick={() => setSelected(!isSelected)}
      >
        <span className="col-span-3">
          {toggleIcon(isSelected)}
          <span className="pl-5 whitespace-nowrap">{log.timestamp}</span>
        </span>
        <span className="col-span-9 ml-5">
          <div className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
            <span className={mapLogColor[log.level]}>[{log.level.toUpperCase()}]</span>{" "}
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
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace !important;
  cursor: pointer;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  border-left: 3px solid;
  padding-left: 12px;

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  ${(p) => p.level && `border-color: ${mapLogBarsColor[p.level]};`}
  ${(p) => p.isSelected && `background-color: var(--color-bg-secondary)`}
`;

import { LogLevel, ILog, Setter } from "@traceo/types";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import styled from "styled-components";

interface ListProps {
  logs: ILog[];
  activeIndex: number;
  showTime: boolean;
  onSelectLog: Setter<{ log: ILog; index: number }>;
}
export const LogsList = ({ logs, activeIndex, showTime, onSelectLog }: ListProps) => {
  const onSelect = (log: ILog, index: number) => {
    onSelectLog({ index, log });
  };

  return (
    <ConditionalWrapper
      emptyView={<DataNotFound label="Logs not found" />}
      isEmpty={logs?.length === 0}
    >
      <ul className="w-full block overflow-y-scroll max-h-[780px] pl-0">
        {logs?.map((log, index) => (
          <LogWrapper
            key={index}
            level={log.level}
            isSelected={index === activeIndex}
            onClick={() => onSelect(log, index)}
          >
            {showTime && <span className="pl-2 pr-3 whitespace-nowrap">{log.timestamp}</span>}
            <span className="pl-2 whitespace-nowrap overflow-hidden text-ellipsis inline-block">
              {log.message}
            </span>
          </LogWrapper>
        ))}
      </ul>
    </ConditionalWrapper>
  );
};

const LogWrapper = styled.li<{
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
  padding-left: 12px;
  border-color: #7c878d;
  margin-bottom: 2px;

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  ${(p) => p.isSelected && `background-color: var(--color-bg-secondary)`}
`;

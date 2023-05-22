import { ILog } from "@traceo/types";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import styled from "styled-components";
import { LogRow } from "./LogRow";
import { forwardRef } from "react";

const ScrollableWrapper = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  display: block;
  max-height: 380px !important;
`;

const LogsTable = styled.table`
  display: flex;
  padding-left: 0px;
  padding-top: 15px;
  overflow-x: hidden;
`;

interface ListProps {
  logs: ILog[];
  showTime: boolean;
  verboseLog: boolean;
}

export const LogsList = forwardRef<undefined, ListProps>(({ logs, ...props }, ref) => {
  return (
    <ConditionalWrapper
      emptyView={<DataNotFound label="Logs not found" />}
      isEmpty={logs?.length === 0}
    >
      <ScrollableWrapper ref={ref}>
        <LogsTable>
          <tbody className="w-full">
            {logs?.map((log, index) => (
              <LogRow key={index} log={log} {...props} />
            ))}
          </tbody>
        </LogsTable>
      </ScrollableWrapper>
    </ConditionalWrapper>
  );
});

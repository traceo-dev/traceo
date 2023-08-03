import { ILog, isEmpty } from "@traceo/types";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { TableLazyLoader } from "../../../../core/components/TableLazyLoader";
import { LogRow } from "./LogRow";
import { forwardRef } from "react";

import styled from "styled-components";

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
  onScroll: (skip: number) => void;
}

export const LogsList = forwardRef<any, ListProps>(
  ({ logs = [], onScroll = undefined, ...props }, ref) => {
    return (
      <ConditionalWrapper
        emptyView={<DataNotFound label="Logs not found" />}
        isEmpty={isEmpty(logs)}
      >
        <TableLazyLoader ref={ref} onScrollBottom={onScroll} nextSkip={logs?.length}>
          <LogsTable>
            <tbody className="w-full">
              {logs?.map((log, index) => (
                <LogRow key={index} log={log} {...props} />
              ))}
            </tbody>
          </LogsTable>
        </TableLazyLoader>
      </ConditionalWrapper>
    );
  }
);

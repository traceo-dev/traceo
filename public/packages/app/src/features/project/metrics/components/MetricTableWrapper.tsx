import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { MetricResponseType } from "@traceo/types";
import { Table, TableColumn } from "@traceo/ui";
import { FC } from "react";
import dayjs from "dayjs";

interface Props {
  fields?: string[];
  metricData: MetricResponseType[];
  isLoading: boolean;
}
export const MetricTableWrapper: FC<Props> = ({ fields = [], metricData, isLoading }) => (
  <ConditionalWrapper
    isEmpty={metricData.length === 0}
    isLoading={isLoading}
    emptyView={<DataNotFound />}
  >
    <Table
      loading={isLoading}
      collection={metricData}
      hovered
      showPagination={true}
      pageSize={50}
      rowsCount={metricData?.length}
    >
      <TableColumn name="Time">
        {({ item }) => dayjs.unix(Number(item.minute)).format("YYYY-MM-DD HH:mm:ss")}
      </TableColumn>
      {fields.map((field, index) => (
        <TableColumn key={index} name={field}>
          {({ item }) => <span>{item[field] ? <span>{item[field]}</span> : "-"}</span>}
        </TableColumn>
      ))}
    </Table>
  </ConditionalWrapper>
);

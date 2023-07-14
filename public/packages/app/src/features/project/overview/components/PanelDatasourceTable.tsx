import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { DashboardPanel, MetricResponseType } from "@traceo/types";
import { Table, TableColumn } from "@traceo/ui";
import { FC, useMemo } from "react";
import dayjs from "dayjs";

interface Props {
  panel?: DashboardPanel;
  fields?: string[];
  metricData: MetricResponseType[];
  isLoading: boolean;
}
export const PanelDatasourceTable: FC<Props> = ({ metricData, isLoading, panel, fields }) => {
  const columns =
    fields ??
    useMemo(() => {
      return panel?.config.series.map(({ field }) => field);
    }, [panel]);

  const getColumnName = (field: string) => {
    const serie = panel?.config.series.find((serie) => serie.field === field);
    return serie.name;
  };

  return (
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
        {columns.map((field, index) => (
          <TableColumn key={index} name={getColumnName(field)}>
            {({ item }) => <span>{item[field] ? <span>{item[field]}</span> : "-"}</span>}
          </TableColumn>
        ))}
      </Table>
    </ConditionalWrapper>
  );
};

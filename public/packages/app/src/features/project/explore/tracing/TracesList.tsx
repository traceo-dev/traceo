import { Span } from "@traceo/types";
import { Table, TableColumn, Tooltip } from "@traceo/ui";
import dateUtils from "../../../../core/utils/date";
import { mapStatusName } from "./utils";

interface Props {
  spans: Span[];
  loading: boolean;
}

export const TracesList = ({ spans, loading = false }: Props) => {
  const parseStatus = (span: Span) => {
    if (!span?.status) {
      return null;
    }

    if (!span?.status_message) {
      return <span>{mapStatusName[span.status]}</span>;
    }

    return (
      <Tooltip title={span?.status_message}>
        <span>{mapStatusName[span.status]}</span>
      </Tooltip>
    );
  };
  return (
    <Table collection={spans} loading={loading} emptyLabel="Traces not found">
      <TableColumn name="Trace ID">
        {({ item }) => (
          <span className="text-blue-500 hover:underline hover:blue-400">{item.trace_id}</span>
        )}
      </TableColumn>
      <TableColumn name="Name" value="name" />
      <TableColumn name="Service" value="service_name" />
      <TableColumn name="Status">{({ item }) => parseStatus(item)}</TableColumn>
      <TableColumn name="Start time">
        {({ item }) => <span>{dateUtils.formatDate(item.start_time, "DD-MM-YYYY HH:mm")}</span>}
      </TableColumn>
      <TableColumn name="Duration">
        {({ item }) => <span>{Number(item.duration).toFixed(2)}ms</span>}
      </TableColumn>
    </Table>
  );
};

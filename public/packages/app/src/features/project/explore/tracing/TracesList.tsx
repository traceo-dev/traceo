import { Setter, Span } from "@traceo/types";
import { Table, TableColumn, Tooltip } from "@traceo/ui";
import dateUtils from "../../../../core/utils/date";
import { parseDuration } from "./utils";

interface Props {
  spans: Span[];
  loading: boolean;
  onSelectTrace: Setter<Span>;
}

export const TracesList = ({ spans = [], loading = false, onSelectTrace = undefined }: Props) => {
  return (
    <Table collection={spans} loading={loading} emptyLabel="Traces not found">
      <TableColumn name="Trace ID">
        {({ item }) => (
          <span
            onClick={() => onSelectTrace(item)}
            className="text-blue-500 hover:underline hover:blue-400"
          >
            {item.trace_id}
          </span>
        )}
      </TableColumn>
      <TableColumn name="Name" value="name" />
      <TableColumn name="Service" value="service_name" />
      <TableColumn name="Status" value="status" />
      <TableColumn name="Start time">
        {({ item }) => (
          <span className="whitespace-nowrap">
            {dateUtils.formatDate(item.start_time, "DD-MM-YYYY HH:mm")}
          </span>
        )}
      </TableColumn>
      <TableColumn name="Duration">
        {({ item }) => <span>{parseDuration(Number(item.duration))}</span>}
      </TableColumn>
    </Table>
  );
};

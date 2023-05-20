import {
  Button,
  Input,
  InputSearch,
  Row,
  Select,
  SelectOptionProps,
  Table,
  TableColumn,
  Tooltip
} from "@traceo/ui";
import { ExploreViewProps } from "../ExplorePage";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ApiResponse, Span, SpanKind, SpanStatusCode } from "@traceo/types";
import { useParams } from "react-router-dom";
import api from "src/core/lib/api";
import dateUtils from "src/core/utils/date";
import { OptionsCollapseGroup } from "../OptionsCollapseGroup";
import { OptionField } from "../OptionField";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useReactQuery } from "src/core/hooks/useReactQuery";

const mapStatusName: Record<SpanStatusCode, string> = {
  [SpanStatusCode.ERROR]: "Error",
  [SpanStatusCode.OK]: "OK",
  [SpanStatusCode.UNSET]: "Unset"
};

const statusOptions = Object.keys(SpanStatusCode)
  .slice(0, 3)
  .map((e) => ({
    label: mapStatusName[e],
    value: e
  }));

const mapKindName: Record<SpanKind, string> = {
  [SpanKind.CLIENT]: "Client",
  [SpanKind.CONSUMER]: "Consumer",
  [SpanKind.INTERNAL]: "Internal",
  [SpanKind.PRODUCER]: "Producer",
  [SpanKind.SERVER]: "Server"
};

const kindOptions = Object.keys(SpanKind)
  .slice(0, 5)
  .map((e) => ({
    label: mapKindName[e],
    value: e
  }));

export const TracesPage = forwardRef(
  (
    {
      setError = undefined,
      setLoading = undefined,
      loading = false,
      ranges = [undefined, undefined]
    }: ExploreViewProps,
    ref
  ) => {
    const { id } = useParams();

    const [traces, setTraces] = useState<Span[]>();
    const [search, setSearch] = useState<string>(null);
    const [serviceName, setServiceName] = useState<string>(null);
    const [spanName, setSpanName] = useState<string>(null);
    const [traceStatus, setTraceStatus] = useState<string>(null);
    const [traceKind, setTraceKind] = useState<string>(null);
    const [durationMin, setDurationMin] = useState<number>(null);
    const [durationMax, setDurationMax] = useState<number>(null);
    const [limit, setLimit] = useState<number>(100);

    const { data: servicesOptions, isFetching: fetchingServices } = useReactQuery<
      SelectOptionProps[]
    >({
      queryKey: ["trace_service_names"],
      url: `/api/tracing/services/${id}`
    });

    const { data: spansOptions, isFetching: fetchingSpans } = useReactQuery<SelectOptionProps[]>({
      queryKey: ["trace_spans_names"],
      url: `/api/tracing/spans/${id}`
    });

    useImperativeHandle(ref, () => ({
      async fetch() {
        setLoading(true);

        const props = {
          projectId: id,
          from: ranges[0],
          to: ranges[1],
          search,
          serviceName,
          spanName,
          traceStatus,
          traceKind,
          durationMin,
          durationMax,
          take: limit
        };

        await api
          .get<ApiResponse<Span[]>>("/api/tracing", props)
          .then((response) => {
            if (response.status === "success") {
              console.log("traces: ", traces);
              setTraces(response.data);
            } else {
              setError(true);
            }
          })
          .catch(() => {
            setError(true);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }));

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

    const clearQuery = () => {
      setSearch("");
      setDurationMax(null);
      setDurationMin(null);
      setServiceName(null);
      setSpanName(null);
      setTraceKind(null);
      setTraceStatus(null);
      setLimit(100);
    };

    const getQueriesLabel = () => {
      const queries: string[] = [];

      search && queries.push(`Search: ${search}`);
      serviceName && queries.push(`Service name: ${serviceName}`);
      spanName && queries.push(`Span name: ${spanName}`);
      traceKind && queries.push(`Trace kind: ${traceKind}`);
      traceStatus && queries.push(`Trace status: ${traceStatus}`);
      durationMax && queries.push(`Duration max: ${durationMax}ms`);
      durationMin && queries.push(`Duration min: ${durationMin}ms`);
      limit && queries.push(`Limit: ${limit}`);

      return queries.join(", ");
    };

    return (
      <div className="flex flex-col">
        <OptionsCollapseGroup
          deafultCollapsed={false}
          title={
            <div className="flex flex-row gap-x-2 items-center">
              <span>Options</span>
              <span className="pl-5 text-xs font-normal italic">{getQueriesLabel()}</span>
            </div>
          }
          footer={
            <Button onClick={() => clearQuery()} icon={<DeleteOutlined />} variant="ghost">
              Clear
            </Button>
          }
        >
          <div className="grid grid-cols-12 pb-3 gap-x-3">
            <OptionField title="Search" className="col-span-12">
              <InputSearch
                value={search}
                onChange={(e) => setSearch(e)}
                placeholder="Search for traces by IDs, names or attributes"
              />
            </OptionField>
          </div>
          <div className="grid grid-cols-12 pb-3 gap-x-3">
            <OptionField title="Service name" className="col-span-3">
              <Select
                options={servicesOptions}
                isClearable
                isLoading={fetchingServices}
                value={serviceName}
                onChange={(opt) => setServiceName(opt?.value)}
              />
            </OptionField>
            <OptionField title="Span name" className="col-span-3">
              <Select
                options={spansOptions}
                isClearable
                isLoading={fetchingSpans}
                value={spanName}
                onChange={(opt) => setSpanName(opt?.value)}
              />
            </OptionField>
            <OptionField title="Trace status" className="col-span-3">
              <Select
                options={statusOptions}
                isClearable
                value={traceStatus}
                onChange={(opt) => setTraceStatus(opt?.value)}
              />
            </OptionField>
            <OptionField title="Trace kind" className="col-span-3">
              <Select
                options={kindOptions}
                isClearable
                value={traceKind}
                onChange={(opt) => setTraceKind(opt?.value)}
              />
            </OptionField>
          </div>
          <div className="grid grid-cols-12 pb-3 gap-x-3">
            <OptionField
              title="Duration min."
              tooltip="Value provided in miliseconds"
              className="col-span-3"
            >
              <Input
                type="number"
                placeholder="eq. 50ms"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target["value"])}
              />
            </OptionField>
            <OptionField
              title="Duration max."
              tooltip="Value provided in miliseconds"
              className="col-span-3"
            >
              <Input
                type="number"
                placeholder="eq. 50ms"
                value={durationMax}
                onChange={(e) => setDurationMax(e.target["value"])}
              />
            </OptionField>
          </div>
          <div className="grid grid-cols-12 pb-3 gap-x-3">
            <OptionField
              title="Limit"
              tooltip="The number of returned result. When empty then first 100 results are returned."
              className="col-span-3"
            >
              <Input type="number" value={limit} onChange={(e) => setLimit(e.target["value"])} />
            </OptionField>
          </div>
        </OptionsCollapseGroup>

        <OptionsCollapseGroup title="Traces" deafultCollapsed={false}>
          <Table collection={traces} loading={loading} emptyLabel="Traces not found">
            <TableColumn name="Trace ID">
              {({ item }) => (
                <span className="text-blue-500 hover:underline hover:blue-400">
                  {item.trace_id}
                </span>
              )}
            </TableColumn>
            <TableColumn name="Name" value="name" />
            <TableColumn name="Service" value="service_name" />
            <TableColumn name="Status">{({ item }) => parseStatus(item)}</TableColumn>
            <TableColumn name="Start time">
              {({ item }) => (
                <span>{dateUtils.formatDate(item.start_time, "DD-MM-YYYY HH:mm")}</span>
              )}
            </TableColumn>
            <TableColumn name="Duration">
              {({ item }) => <span>{Number(item.duration).toFixed(2)}ms</span>}
            </TableColumn>
          </Table>
        </OptionsCollapseGroup>
      </div>
    );
  }
);

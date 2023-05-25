import { Col, Input, InputSearch, Select, SelectOptionProps } from "@traceo/ui";
import { ExploreViewProps } from "../ExplorePage";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Span, SpanKind, SpanStatusCode } from "@traceo/types";
import { useParams } from "react-router-dom";
import { OptionsCollapseGroup } from "../components/OptionsCollapseGroup";
import { Field } from "../components/Field";
import { DeleteOutlined } from "@ant-design/icons";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { mapStatusName, mapKindName } from "./utils";
import { tracingApi } from "./api";
import { TracesList } from "./TracesList";
import { InlineFields } from "../components/InlineFields";

const statusOptions = Object.keys(SpanStatusCode)
  .slice(0, 3)
  .map((e) => ({
    label: mapStatusName[e],
    value: e
  }));

const kindOptions = Object.keys(SpanKind)
  .slice(0, 5)
  .map((e) => ({
    label: mapKindName[e],
    value: e
  }));

export const TracesPage = forwardRef(
  (
    {
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

        await tracingApi
          .loadTraces(props)
          .then((response) => {
            if (response.status === "success") {
              setTraces(response.data);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }));

    const clearQuery = () => {
      const queries = [
        setSearch,
        setDurationMax,
        setDurationMin,
        setServiceName,
        setSpanName,
        setTraceKind,
        setTraceStatus
      ];
      queries.map((e) => e(null));
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
      <Col>
        <OptionsCollapseGroup
          title="Options"
          collapsedText={getQueriesLabel()}
          extra={<DeleteOutlined className="icon-btn" onClick={() => clearQuery()} />}
        >
          <InlineFields>
            <Field title="Search" className="col-span-12">
              <InputSearch
                value={search}
                onChange={(e) => setSearch(e)}
                placeholder="Search for traces by IDs, names or attributes"
              />
            </Field>
          </InlineFields>
          <InlineFields>
            <Field title="Service name" className="col-span-3">
              <Select
                options={servicesOptions}
                isClearable
                isLoading={fetchingServices}
                value={serviceName}
                onChange={(opt) => setServiceName(opt?.value)}
              />
            </Field>
            <Field title="Span name" className="col-span-3">
              <Select
                options={spansOptions}
                isClearable
                isLoading={fetchingSpans}
                value={spanName}
                onChange={(opt) => setSpanName(opt?.value)}
              />
            </Field>
            <Field title="Trace status" className="col-span-3">
              <Select
                options={statusOptions}
                isClearable
                value={traceStatus}
                onChange={(opt) => setTraceStatus(opt?.value)}
              />
            </Field>
            <Field title="Trace kind" className="col-span-3">
              <Select
                options={kindOptions}
                isClearable
                value={traceKind}
                onChange={(opt) => setTraceKind(opt?.value)}
              />
            </Field>
          </InlineFields>
          <InlineFields>
            <Field
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
            </Field>
            <Field
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
            </Field>
          </InlineFields>
          <InlineFields>
            <Field
              title="Limit"
              tooltip="The number of returned result. When empty then first 100 results are returned."
              className="col-span-3"
            >
              <Input type="number" value={limit} onChange={(e) => setLimit(e.target["value"])} />
            </Field>
          </InlineFields>
        </OptionsCollapseGroup>

        <OptionsCollapseGroup title="Traces" deafultCollapsed={false}>
          <TracesList loading={loading} spans={traces} />
        </OptionsCollapseGroup>
      </Col>
    );
  }
);
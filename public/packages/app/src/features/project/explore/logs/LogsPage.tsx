import { ILog, LogsQueryProps, TimeRange } from "@traceo/types";
import { forwardRef, lazy, useImperativeHandle, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { LogsList } from "./LogsList";
import { ExploreViewProps } from "../ExplorePage";
import { OptionsCollapseGroup } from "../components/OptionsCollapseGroup";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { logsApi } from "./api";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  MenuUnfoldOutlined,
  UpOutlined
} from "@ant-design/icons";
import { Col, Input, InputSearch } from "@traceo/ui";
import { Field } from "../components/Field";
import { InlineFields } from "../components/InlineFields";
import { ActionButton } from "../../../../core/components/ActionButton";
import { ButtonOptionsWrapper } from "../components";

const LazyLogsExplorePlot = lazy(
  () => import("../../../../core/components/Charts/Logs/LogsExploreChart")
);

export const LogsPage = forwardRef(
  (
    {
      setLoading = undefined,
      setRanges = undefined,
      loading = false,
      ranges = [undefined, undefined]
    }: ExploreViewProps,
    ref
  ) => {
    const { id } = useParams();
    const tableRef = useRef(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [logs, setLogs] = useState<ILog[]>([]);
    const [graph, setGraph] = useState<[number, number][]>([]);

    const [graphLoading, setGraphLoading] = useState<boolean>(false);

    const [limit, setLimit] = useState<number>(1000);
    const [search, setSearch] = useState<string>(undefined);

    const [showLogTime, setShowLogTime] = useState<boolean>(true);
    const [verboseLog, setVerboseLog] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      fetch
    }));

    const baseQueryProps = {
      projectId: id,
      search
    };

    const fetch = async () => {
      const props = {
        from: ranges[0],
        to: ranges[1],
        ...baseQueryProps
      };

      await loadData(props);
    };

    const loadData = async (props: LogsQueryProps) => {
      setLoading(true);
      setGraphLoading(true);

      await logsApi
        .loadGraph(props)
        .then((resp) => {
          setGraph(resp.data.graph);
        })
        .finally(() => setGraphLoading(false));

      await logsApi
        .loadLogs({
          ...props,
          take: limit
        })
        .then((resp) => {
          setLogs(resp.data.logs);
        })
        .finally(() => setLoading(false));
    };

    const onZoom = async (ranges: TimeRange) => {
      setRanges(ranges);

      await loadData({
        from: ranges[0],
        to: ranges[1],
        ...baseQueryProps
      });
    };

    const getQueriesLabel = () => {
      const queries: string[] = [];

      search && queries.push(`Search: ${search}`);
      limit && queries.push(`Limit: ${limit}`);

      return queries.join(", ");
    };

    const clearQuery = () => {
      inputRef.current.value = null;
      setLimit(250);
    };

    const scrollTop = () => {
      if (!tableRef) {
        return;
      }
      tableRef.current.scrollTop = 0;
    };

    const scrollBottom = () => {
      if (!tableRef) {
        return;
      }
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    };

    return (
      <Col>
        <OptionsCollapseGroup
          deafultCollapsed={true}
          title="Options"
          collapsedText={getQueriesLabel()}
          extra={<DeleteOutlined className="icon-btn" onClick={() => clearQuery()} />}
        >
          <InlineFields>
            <Field title="Search" className="col-span-12">
              <InputSearch
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e)}
                placeholder="Search for logs"
              />
            </Field>
          </InlineFields>
          <InlineFields>
            <Field
              title="Limit"
              tooltip="The number of returned result. When empty then first 1000 results are returned. Max 2000."
              className="col-span-3"
            >
              <Input
                type="number"
                min={1}
                max={2000}
                value={limit}
                onChange={(e) => setLimit(e.target["value"])}
              />
            </Field>
          </InlineFields>
        </OptionsCollapseGroup>
        <OptionsCollapseGroup
          title="Graph"
          deafultCollapsed={false}
          loading={graph?.length > 0 && graphLoading}
        >
          <ConditionalWrapper
            isLoading={graph?.length === 0 && graphLoading}
            isEmpty={graph && graph.length === 0}
            emptyView={<DataNotFound label="No results for graph" />}
          >
            <LazyLogsExplorePlot ranges={ranges} graph={graph} zoom={true} onZoom={onZoom} />
          </ConditionalWrapper>
        </OptionsCollapseGroup>

        <OptionsCollapseGroup
          title="Logs"
          deafultCollapsed={false}
          loading={loading}
          extra={
            <span className="text-xs font-semibold text-primary">
              {(logs || []).length} logs found
            </span>
          }
        >
          <ButtonOptionsWrapper>
            <ActionButton
              icon={<DownOutlined />}
              tooltip="Scroll to bottom"
              isActive={false}
              onClick={() => scrollBottom()}
            />
            <ActionButton
              icon={<UpOutlined />}
              tooltip="Scroll to top"
              isActive={false}
              onClick={() => scrollTop()}
            />
            <ActionButton
              icon={<MenuUnfoldOutlined />}
              tooltip="Verbose"
              isActive={verboseLog}
              onClick={() => setVerboseLog(!verboseLog)}
            />
            <ActionButton
              icon={<ClockCircleOutlined />}
              tooltip="Show log timestamp"
              isActive={showLogTime}
              onClick={() => setShowLogTime(!showLogTime)}
            />
          </ButtonOptionsWrapper>

          <LogsList ref={tableRef} verboseLog={verboseLog} showTime={showLogTime} logs={logs} />
        </OptionsCollapseGroup>
      </Col>
    );
  }
);

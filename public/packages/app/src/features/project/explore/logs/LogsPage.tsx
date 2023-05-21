import { ILog } from "@traceo/types";
import { forwardRef, lazy, useImperativeHandle, useState } from "react";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { LogsList } from "./LogsList";
import { ExploreViewProps } from "../ExplorePage";
import { OptionsCollapseGroup } from "../components/OptionsCollapseGroup";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { LogsQueryProps, logsApi } from "./api";
import { CloseOutlined, DeleteOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import {
  Col,
  Input,
  InputSearch,
  Row,
  Switch,
  Typography,
  conditionClass,
  joinClasses
} from "@traceo/ui";
import { Field } from "../components/Field";
import { LogDetailsForm } from "./LogDetailsForm";
import { InlineFields } from "../components/InlineFields";
import styled from "styled-components";

const LazyLogsExplorePlot = lazy(
  () => import("../../../../core/components/Charts/Logs/LogsExploreChart")
);

const TableOptionsWrapper = styled.div`
  padding: 18px;
  border: 1px solid var(--color-bg-secondary);
  border-radius: 4px;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 38px;
`;

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
    const [logs, setLogs] = useState<ILog[]>([]);
    const [graph, setGraph] = useState<[number, number][]>([]);

    const [graphLoading, setGraphLoading] = useState<boolean>(false);

    const [limit, setLimit] = useState<number>(250);
    const [search, setSearch] = useState<string>(undefined);

    const [selectedLog, setSelectedLog] = useState<{ index: number; log: ILog }>(undefined);
    const [showLogTime, setShowLogTime] = useState<boolean>(true);

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

    const onZoom = async (ranges: [number, number]) => {
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
      const queries = [setSearch];
      queries.map((e) => e(null));
      setLimit(250);
    };

    // navigate to previous log
    const logUp = () => {
      const index = selectedLog.index - 1;
      if (index > -1) {
        const log = logs[index];
        setSelectedLog({ index, log });
      }
    };

    // navigate to next log
    const logDown = () => {
      const index = selectedLog.index + 1;
      if (index < logs.length) {
        const log = logs[index];
        setSelectedLog({ index, log });
      }
    };

    const renderDetailsToolbar = () => {
      const isNextLog = () => {
        return !!logs[selectedLog.index + 1];
      };

      const isPreviousLog = () => {
        return !!logs[selectedLog.index - 1];
      };

      return (
        <Row>
          <UpOutlined
            className={joinClasses("icon-btn", conditionClass(!isPreviousLog(), "opacity-20"))}
            onClick={() => logUp()}
          />
          <DownOutlined
            className={joinClasses("icon-btn", conditionClass(!isNextLog(), "opacity-20"))}
            onClick={() => logDown()}
          />
          <CloseOutlined className="icon-btn" onClick={() => setSelectedLog(undefined)} />
        </Row>
      );
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
                value={search}
                onChange={(e) => setSearch(e)}
                placeholder="Search for logs"
              />
            </Field>
          </InlineFields>
          <InlineFields>
            <Field
              title="Limit"
              tooltip="The number of returned result. When empty then first 250 results are returned. Max 2000."
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

        <div className="grid grid-cols-12">
          <div className={`col-span-${selectedLog ? "8" : "12"}`}>
            <OptionsCollapseGroup
              title="Logs"
              deafultCollapsed={false}
              extra={
                <span className="text-xs font-semibold text-primary">
                  {(logs || []).length} logs found
                </span>
              }
            >
              <TableOptionsWrapper>
                <Row gap="x-2">
                  <Typography weight="semibold">Time</Typography>
                  <Switch
                    value={showLogTime}
                    onChange={(e) => setShowLogTime(e.target["checked"])}
                  />
                </Row>
              </TableOptionsWrapper>
              <ConditionalWrapper isLoading={loading}>
                <LogsList
                  showTime={showLogTime}
                  activeIndex={selectedLog?.index}
                  onSelectLog={({ index, log }) => setSelectedLog({ index, log })}
                  logs={logs}
                />
              </ConditionalWrapper>
            </OptionsCollapseGroup>
          </div>
          {selectedLog && (
            <div className={`ml-2 col-span-${selectedLog ? "4" : "0"}`}>
              <OptionsCollapseGroup
                title="Log details"
                deafultCollapsed={false}
                extra={renderDetailsToolbar()}
              >
                <LogDetailsForm {...selectedLog?.log} />
              </OptionsCollapseGroup>
            </div>
          )}
        </div>
      </Col>
    );
  }
);

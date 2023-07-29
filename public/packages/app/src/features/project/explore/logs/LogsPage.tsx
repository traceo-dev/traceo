import { ILog, LogsQueryProps, TimeRange, UplotDataType } from "@traceo/types";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
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
import { Col, InputSearch } from "@traceo/ui";
import { Field } from "../components/Field";
import { InlineFields } from "../components/InlineFields";
import { ActionButton } from "../../../../core/components/ActionButton";
import { ButtonOptionsWrapper } from "../components";
import { UplotLogsGraph } from "./UplotLogsGraph";
import styled from "styled-components";

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
    const [graph, setGraph] = useState<UplotDataType>([[]]);

    const [graphLoading, setGraphLoading] = useState<boolean>(false);

    const [search, setSearch] = useState<string>(undefined);

    const [showLogTime, setShowLogTime] = useState<boolean>(true);
    const [verboseLog, setVerboseLog] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      fetch
    }));

    const fetch = async (props?: Partial<LogsQueryProps>) => {
      setGraphLoading(true);

      await logsApi
        .loadGraph({
          from: ranges[0],
          to: ranges[1],
          projectId: id,
          search,
          ...props
        })
        .then((resp) => {
          setGraph(resp.data.graph);
        })
        .finally(() => setGraphLoading(false));

      await fetchTableLogs(0, props);
    };

    const fetchTableLogs = async (skip: number, props?: Partial<LogsQueryProps>) => {
      setLoading(true);

      await logsApi
        .loadLogs({
          from: ranges[0],
          to: ranges[1],
          take: 100,
          skip,
          projectId: id,
          search,
          ...props
        })
        .then((resp) => {
          const newLogs = resp.data.logs ?? [];

          if (skip > 0) {
            setLogs([...logs, ...newLogs]);
          } else {
            setLogs(newLogs);
          }
        })
        .finally(() => setLoading(false));
    };

    const onNext = async (skip: number) => {
      if (loading) {
        return;
      }

      await fetchTableLogs(skip);
    };

    const onZoom = async (ranges: TimeRange) => {
      setRanges(ranges);
      await fetch({
        from: ranges[0],
        to: ranges[1]
      });
    };

    const getQueriesLabel = () => {
      const queries: string[] = [];
      if (search) {
        queries.push(`Search: ${search}`);
      }
      return queries.join(", ");
    };

    const clearQuery = () => {
      inputRef.current.value = null;
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
        </OptionsCollapseGroup>
        <OptionsCollapseGroup
          title="Graph"
          deafultCollapsed={false}
          loading={graphLoading}
          scrollableBody={false}
        >
          <ConditionalWrapper
            isLoading={graph && graph[0].length === 0 && graphLoading}
            isEmpty={!graph || (graph && graph[0].length <= 1)}
            emptyView={<DataNotFound label="No results for graph" />}
          >
            <UplotLogsGraph data={graph} onZoom={onZoom} />
          </ConditionalWrapper>
        </OptionsCollapseGroup>

        <OptionsCollapseGroup title="Logs" deafultCollapsed={false} loading={loading}>
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

          <LogsList
            ref={tableRef}
            onScroll={onNext}
            verboseLog={verboseLog}
            showTime={showLogTime}
            logs={logs}
          />
        </OptionsCollapseGroup>
      </Col>
    );
  }
);

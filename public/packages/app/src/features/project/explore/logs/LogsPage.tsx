import { ILog, LogLevel } from "@traceo/types";
import { forwardRef, lazy, useImperativeHandle, useState } from "react";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useLogLevels } from "../../../../core/hooks/useLogLevels";
import { LogsList } from "./LogsList";
import { ExploreViewProps } from "../ExplorePage";
import { OptionsCollapseGroup } from "../OptionsCollapseGroup";
import { DataNotFound } from "src/core/components/DataNotFound";
import { LogsQueryProps, logsApi } from "./api";
import { CloseOutlined, DeleteOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Input, InputSearch, Row, Space, Switch, conditionClass, joinClasses } from "@traceo/ui";
import { OptionField } from "../OptionField";
import { LogDetailsForm } from "./LogDetailsForm";

const LazyLogsExplorePlot = lazy(
  () => import("../../../../core/components/Charts/Logs/LogsExploreChart")
);


export const LogsPage = forwardRef(
  (
    {
      setError = undefined,
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
    const { levels, setLevels } = useLogLevels();

    const [graphLoading, setGraphLoading] = useState<boolean>(false);

    const [limit, setLimit] = useState<number>(250);
    const [search, setSearch] = useState<string>(null);

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

    const legendItems = () => {
      const a = Object.values(LogLevel).reduce((acc, val) => {
        const name = val.charAt(0).toUpperCase() + val.slice(1);
        acc[name] = levels.includes(val);
        return acc;
      }, {});

      return a;
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
      setSearch("");
      setLimit(250);
    };

    const logUp = () => {
      const index = selectedLog.index - 1;
      if (index > -1) {
        const log = logs[index];
        setSelectedLog({ index, log });
      }
    };

    const logDown = () => {
      const index = selectedLog.index + 1;
      if (index < logs.length) {
        const log = logs[index];
        setSelectedLog({ index, log });
      }
    };

    const isNextLog = () => {
      return !!logs[selectedLog.index + 1];
    };

    const isPreviousLog = () => {
      return !!logs[selectedLog.index - 1];
    };

    return (
      <>
        <OptionsCollapseGroup
          deafultCollapsed={true}
          title={
            <div className="flex flex-row gap-x-2 items-center">
              <span>Options</span>
              <span className="pl-5 text-xs font-normal italic">{getQueriesLabel()}</span>
            </div>
          }
          extra={<DeleteOutlined className="icon-btn" onClick={() => clearQuery()} />}
        >
          <div className="grid grid-cols-12 pb-3 gap-x-3">
            <OptionField title="Search" className="col-span-12">
              <InputSearch
                value={search}
                onChange={(e) => setSearch(e)}
                placeholder="Search for logs"
              />
            </OptionField>
          </div>
          <div className="grid grid-cols-12 pb-3 gap-x-3">
            <OptionField
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
            </OptionField>
          </div>
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
            <LazyLogsExplorePlot
              legendItems={legendItems()}
              setLegendItems={setLevels}
              ranges={ranges}
              setRanges={setRanges}
              graph={graph}
              zoom={true}
              onZoom={onZoom}
            />
          </ConditionalWrapper>
        </OptionsCollapseGroup>

        <div className="grid grid-cols-12">
          <div className={`col-span-${selectedLog ? "8" : "12"}`}>
            <OptionsCollapseGroup
              title="Logs"
              deafultCollapsed={false}
              extra={
                <span className="text-xs font-semibold text-primary">
                  {logs.length} logs found
                </span>
              }
            >
              <div className="p-3 border flex flex-row items-center gap-x-12 border-solid border-secondary rounded w-full">
                <div className="flex flex-row items-center gap-x-1">
                  <span className="font-semibold">Time</span>
                  <Switch
                    value={showLogTime}
                    onChange={(e) => setShowLogTime(e.target["checked"])}
                  />
                </div>
                <div className="flex flex-row items-center gap-x-1">
                  <span className="font-semibold">Unique</span>
                  <Switch />
                </div>
              </div>
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
                extra={
                  <div className="flex flex-row items-center gap-x-1">
                    <UpOutlined
                      className={joinClasses(
                        "icon-btn",
                        conditionClass(!isPreviousLog(), "opacity-20")
                      )}
                      onClick={() => logUp()}
                    />
                    <DownOutlined
                      className={joinClasses(
                        "icon-btn",
                        conditionClass(!isNextLog(), "opacity-20")
                      )}
                      onClick={() => logDown()}
                    />
                    <CloseOutlined
                      className="icon-btn"
                      onClick={() => setSelectedLog(undefined)}
                    />
                  </div>
                }
              >
                <LogDetailsForm {...selectedLog?.log} />
              </OptionsCollapseGroup>
            </div>
          )}
        </div>
      </>
    );
  }
);

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
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input } from "@traceo/ui";
import { OptionField } from "../OptionField";

const LazyLogsExplorePlot = lazy(
  () => import("../../../../core/components/Charts/Logs/LogsExploreChart")
);

type LogsResponseType = {
  logs: ILog[];
  graph: [number, number][];
};

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

    useImperativeHandle(ref, () => ({
      fetch
    }));

    const baseQueryProps = {
      projectId: id,
      levels: [LogLevel.Debug, LogLevel.Error, LogLevel.Info, LogLevel.Log, LogLevel.Warn]
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

      limit && queries.push(`Limit: ${limit}`);

      return queries.join(", ");
    };

    const clearQuery = () => {
      setLimit(250);
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
          footer={
            <Button onClick={() => clearQuery()} icon={<DeleteOutlined />} variant="ghost">
              Clear
            </Button>
          }
        >
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
        <OptionsCollapseGroup title="Logs" deafultCollapsed={false}>
          <ConditionalWrapper isLoading={loading}>
            <LogsList logs={logs} />
          </ConditionalWrapper>
        </OptionsCollapseGroup>
      </>
    );
  }
);

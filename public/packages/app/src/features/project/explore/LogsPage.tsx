import ExplorePageWrapper from "./ExplorePageWrapper";
import { LoadingOutlined } from "@ant-design/icons";
import { ILog, LogLevel } from "@traceo/types";
import { TimeRangePicker, Card } from "@traceo/ui";
import dayjs from "dayjs";
import { lazy, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useLogLevels } from "../../../core/hooks/useLogLevels";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { statisticUtils } from "../../../core/utils/statistics";
import { LogsList } from "./components/LogsList";
import { relativeTimeOptions } from "./components/utils";

const LazyLogsExplorePlot = lazy(
  () => import("../../../core/components/Charts/Logs/LogsExploreChart")
);

const MAX_DATE = new Date(dayjs().unix() * 1e3);

const LogsPage = () => {
  const { id } = useParams();
  const { levels, setLevels } = useLogLevels();
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(30, "minute").unix(),
    to: dayjs().unix()
  });

  const {
    data: logs = [],
    isLoading,
    refetch
  } = useReactQuery<ILog[]>({
    queryKey: [`logs_${id}`],
    url: "/api/project/logs",
    params: { id, from: ranges[0], to: ranges[1], levels }
  });

  useEffect(() => {
    refetch();
  }, [levels, ranges]);

  const dataSource = useMemo(
    () => statisticUtils.parseLogs([ranges[0], ranges[1]], logs),
    [logs]
  );

  const legendItems = () => {
    const a = Object.values(LogLevel).reduce((acc, val) => {
      const name = val.charAt(0).toUpperCase() + val.slice(1);
      acc[name] = levels.includes(val);
      return acc;
    }, {});

    return a;
  };

  const renderToolbar = (
    <div className="flex flex-row gap-x-5 items-center">
      {isLoading && <LoadingOutlined />}
      <TimeRangePicker
        value={ranges}
        options={relativeTimeOptions}
        maxHourPeriod={3}
        submit={(val: [number, number]) => setRanges(val)}
        maxDate={MAX_DATE}
      />
    </div>
  );

  return (
    <ExplorePageWrapper>
      <Card className="mb-0 h-full" title="Histogram" extra={renderToolbar}>
        <ConditionalWrapper isLoading={isLoading}>
          <LazyLogsExplorePlot
            legendItems={legendItems()}
            setLegendItems={setLevels}
            setRanges={setRanges}
            logs={dataSource}
            zoom={true}
          />
        </ConditionalWrapper>
      </Card>
      <LogsList isLoading={isLoading} logs={logs} />
    </ExplorePageWrapper>
  );
};

export default LogsPage;

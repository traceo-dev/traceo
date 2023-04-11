import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useProject } from "../../../../core/hooks/useProject";
import dateUtils from "../../../../core/utils/date";
import { statisticUtils } from "../../../../core/utils/statistics";
import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { ErrorDetails } from "@traceo/types";
import { Typography, Card } from "@traceo/ui";
import { useParams } from "react-router-dom";
import IncidentsTodayChart from "../../../../core/components/Charts/Incidents/IncidentsTodayChart";
import { useMemo } from "react";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";

export const TodaySection = () => {
  const { id } = useParams();
  const { project } = useProject();

  const {
    data: dataSource,
    isLoading,
    isFetching,
    refetch
  } = useReactQuery<ErrorDetails[]>({
    queryKey: [`daily_stats_${id}`],
    url: "/api/statistics/daily",
    params: {
      id
    }
  });

  const lastEventAt =
    project?.lastEventAt && dateUtils.isTodayDate(project?.lastEventAt)
      ? dateUtils.formatDate(project?.lastEventAt, "HH:mm")
      : "--:--";

  const payload = useMemo(() => {
    return statisticUtils.parseErrorsToTodayPlotSource(dataSource);
  }, [dataSource]);

  return (
    <div className="grid grid-cols-5 w-full mb-1">
      <div className="col-span-4 h-full">
        <Card title="Today" className="h-full" extra={isFetching && <LoadingOutlined />}>
          <ConditionalWrapper isLoading={isLoading}>
            <IncidentsTodayChart stats={payload.data} />
          </ConditionalWrapper>
        </Card>
      </div>
      <div className="col-span-1 ml-1">
        <div className="flex flex-col items-stretch h-full">
          <div className="h-full mb-1">
            <Card
              title="Events count"
              className="h-full"
              extra={
                isFetching ? (
                  <LoadingOutlined />
                ) : (
                  <SyncOutlined className="text-xs" onClick={() => refetch()} />
                )
              }
            >
              <ConditionalWrapper isLoading={isLoading}>
                <Typography size="xxl" weight="semibold">
                  {payload.count || 0}
                </Typography>
              </ConditionalWrapper>
            </Card>
          </div>
          <div className="h-full">
            <Card className="h-full" title="Last seen">
              <ConditionalWrapper isLoading={isLoading}>
                <Typography size="xxl" weight="semibold" className="text-center">
                  {lastEventAt}
                </Typography>
              </ConditionalWrapper>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

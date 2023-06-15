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
import { ContentCard } from "src/core/components/ContentCard";

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
        <ContentCard name="Today" className="h-full" loading={isFetching}>
          <ConditionalWrapper>
            <IncidentsTodayChart stats={payload.data} />
          </ConditionalWrapper>
        </ContentCard>
      </div>
      <div className="col-span-1 ml-1">
        <div className="flex flex-col items-stretch h-full">
          <div className="h-full mb-1">
            <ContentCard
              name="Events count"
              loading={isFetching}
              className="h-full"
              extra={
                !isFetching &&
                !isLoading && <SyncOutlined className="text-xs" onClick={() => refetch()} />
              }
            >
              <ConditionalWrapper>
                <Typography size="xxl" weight="semibold">
                  {payload.count || 0}
                </Typography>
              </ConditionalWrapper>
            </ContentCard>
          </div>
          <div className="h-full">
            <ContentCard className="h-full" name="Last seen" loading={isFetching}>
              <ConditionalWrapper>
                <Typography size="xxl" weight="semibold" className="text-center">
                  {lastEventAt}
                </Typography>
              </ConditionalWrapper>
            </ContentCard>
          </div>
        </div>
      </div>
    </div>
  );
};

import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useProject } from "../../../../core/hooks/useProject";
import dateUtils from "../../../../core/utils/date";
import { SyncOutlined } from "@ant-design/icons";
import { Typography } from "@traceo/ui";
import { useParams } from "react-router-dom";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { UPlotTodayEventsGraph } from "./UPlotTodayEventsGraph";
import { DashboardPanel } from "../../../../core/components/DashboardPanel";

export const TodaySection = () => {
  const { id } = useParams();
  const { project } = useProject();

  const {
    data = {
      count: 0,
      graph: [[]]
    },
    isLoading,
    isFetching,
    refetch
  } = useReactQuery<{
    graph: [number[]];
    count: number;
  }>({
    queryKey: [`daily_stats_${id}`],
    url: "/api/event/graph/project-daily",
    params: {
      id
    }
  });

  const lastEventAt =
    project?.lastEventAt && dateUtils.isTodayDate(project?.lastEventAt)
      ? dateUtils.formatDate(project?.lastEventAt, "HH:mm")
      : "--:--";

  const isEmpty = data && data?.graph[0].length === 0;

  return (
    <div className="grid grid-cols-5 w-full mb-1">
      <div className="col-span-4 h-full">
        {/* <DashboardPanel
          loading={isFetching || isLoading}
          name="Today's events"
          className="h-full"
        >
          <ConditionalWrapper isLoading={isLoading} isEmpty={isEmpty}>
            <UPlotTodayEventsGraph data={data.graph} />
          </ConditionalWrapper>
        </DashboardPanel> */}
      </div>
      <div className="col-span-1 ml-1">
        <div className="flex flex-col items-stretch h-full">
          <div className="h-full mb-1">
            {/* <DashboardPanel
              name="Events count"
              loading={isFetching}
              className="h-full"
              options={
                !isFetching &&
                !isLoading && <SyncOutlined className="text-xs" onClick={() => refetch()} />
              }
            >
              <ConditionalWrapper isEmpty={isEmpty}>
                <Typography size="xxl" weight="semibold">
                  {data.count || 0}
                </Typography>
              </ConditionalWrapper>
            </DashboardPanel> */}
          </div>
          <div className="h-full">
            {/* <DashboardPanel className="h-full" name="Last seen" loading={isFetching}>
              <ConditionalWrapper isEmpty={isEmpty}>
                <Typography size="xxl" weight="semibold" className="text-center">
                  {lastEventAt}
                </Typography>
              </ConditionalWrapper>
            </DashboardPanel> */}
          </div>
        </div>
      </div>
    </div>
  );
};

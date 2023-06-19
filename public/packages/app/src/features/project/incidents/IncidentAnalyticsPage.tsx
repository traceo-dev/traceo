import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { Typography, Card } from "@traceo/ui";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { UplotDataType } from "@traceo/types";
import { UPlotTodayEventsGraph } from "../overview/components/UPlotTodayEventsGraph";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { UPlotOverviewEventsGraph } from "../overview/components/UPlotOverviewEventsGraph";

export const IncidentAnalyticsPage = () => {
  const { iid } = useParams();
  const { incident } = useSelector((state: StoreState) => state.incident);

  const from = dayjs.unix(incident.createdAt).subtract(5, "days").unix();
  const { data: daily = { graph: [[]], count: 0 }, isLoading } = useReactQuery<{
    graph: UplotDataType;
    count: number;
  }>({
    queryKey: ["today_events"],
    url: `/api/event/graph/incident-daily`,
    params: { id: iid }
  });

  const { data: overview = { graph: [[]], count: 0 }, isLoading: isOverviewLoading } =
    useReactQuery<{ graph: UplotDataType }>({
      queryKey: ["overview_events"],
      url: `/api/event/graph/incident-overview`,
      params: { id: iid, from }
    });

  const lastSeenToday = dayjs.unix(incident.lastEventAt).isToday()
    ? dayjs.unix(incident.lastEventAt).format("HH:mm:ss")
    : "-- : --";

  return (
    <IncidentPageWrapper>
      <div className="grid grid-cols-5 w-full mb-1">
        <div className="col-span-4 h-full">
          <Card title="Today" className="h-full">
            <ConditionalWrapper isLoading={isLoading}>
              <UPlotTodayEventsGraph data={daily.graph} />
            </ConditionalWrapper>
          </Card>
        </div>
        <div className="col-span-1 ml-1">
          <ConditionalWrapper>
            <div className="flex flex-col items-stretch h-full">
              <div className="h-full mb-1">
                <Card title="Errors count" className="h-full">
                  <Typography size="xxl" weight="semibold">
                    {daily.count}
                  </Typography>
                </Card>
              </div>
              <div className="h-full">
                <Card className="h-full" title="Last seen">
                  <Typography size="xxl" weight="semibold">
                    {lastSeenToday}
                  </Typography>
                </Card>
              </div>
            </div>
          </ConditionalWrapper>
        </div>
      </div>
      <Card title="Last month">
        <ConditionalWrapper isLoading={isOverviewLoading}>
          <UPlotOverviewEventsGraph data={overview.graph} />
        </ConditionalWrapper>
      </Card>
    </IncidentPageWrapper>
  );
};

export default IncidentAnalyticsPage;

import dateUtils from "../../../core/utils/date";
import { statisticUtils } from "../../../core/utils/statistics";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { Typography, Card } from "@traceo/ui";
import { useMemo } from "react";
import IncidentsTodayChart from "../../../core/components/Charts/Incidents/IncidentsTodayChart";
import IncidentsOverviewChart from "../../../core/components/Charts/Incidents/IncidentsOverviewChart";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useIncidentSelector } from "../../../core/hooks/useIncidentSelector";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

export const IncidentAnalyticsPage = () => {
  const { iid } = useParams();
  const { groupedEvents } = useIncidentSelector();

  const from = dayjs().startOf("d").local().unix();
  const {
    data: events = [],
    isLoading,
    isRefetching
  } = useReactQuery({
    queryKey: ["today_events"],
    url: `/api/event/incident/${iid}/today`,
    params: { from }
  });

  const dataSource = useMemo(() => {
    return statisticUtils.parseTodayEvents(events);
  }, [events]);

  return (
    <IncidentPageWrapper>
      <div className="grid grid-cols-5 w-full mb-1">
        <div className="col-span-4 h-full">
          <Card title="Today" className="h-full">
            <ConditionalWrapper isLoading={isLoading || isRefetching}>
              <IncidentsTodayChart stats={dataSource?.data} />
            </ConditionalWrapper>
          </Card>
        </div>
        <div className="col-span-1 ml-1">
          <ConditionalWrapper>
            <div className="flex flex-col items-stretch h-full">
              <div className="h-full mb-1">
                <Card title="Errors count" className="h-full">
                  <Typography size="xxl" weight="semibold">
                    {dataSource?.count}
                  </Typography>
                </Card>
              </div>
              <div className="h-full">
                <Card className="h-full" title="Last seen">
                  <Typography size="xxl" weight="semibold">
                    {dateUtils.formatDate(dataSource?.last, "HH:mm")}
                  </Typography>
                </Card>
              </div>
            </div>
          </ConditionalWrapper>
        </div>
      </div>
      <Card title="Total overview">
        <ConditionalWrapper>
          <IncidentsOverviewChart data={groupedEvents} />
        </ConditionalWrapper>
      </Card>
    </IncidentPageWrapper>
  );
};

export default IncidentAnalyticsPage;

import { StoreState } from "@store/types";
import { Card } from "@traceo/ui";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import IncidentTimelineChart from "../../../../core/components/Charts/Incidents/IncidentTimelineChart";
import { RouterLink } from "../../../../core/components/RouterLink";

export const TimelineSection = () => {
  const { id, iid } = useParams();
  const { groupedEvents, isLoading } = useSelector((state: StoreState) => state.groupedEvents);

  return (
    <Card
      title="Timeline"
      className="h-auto"
      extra={
        <RouterLink
          to={`/project/${id}/incidents/${iid}/analytics`}
          className="text-xs font-semibold"
        >
          More
        </RouterLink>
      }
    >
      <IncidentTimelineChart isLoading={isLoading} events={groupedEvents} />
    </Card>
  );
};

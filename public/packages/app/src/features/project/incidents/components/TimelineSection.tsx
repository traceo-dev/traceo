import { StoreState } from "@store/types";
import { Card } from "@traceo/ui";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import IncidentTimelineChart from "../../../../core/components/Charts/Incidents/IncidentTimelineChart";
import { RouterLink } from "../../../../core/components/RouterLink";
import { UPlotEventsGrap } from "./UPlotEventsGraph";

export const TimelineSection = () => {
  const { id, iid } = useParams();
  const { incident } = useSelector((state: StoreState) => state.incident);

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
      <UPlotEventsGrap incident={incident} />
      {/* <IncidentTimelineChart isLoading={isLoading} events={groupedEvents} /> */}
    </Card>
  );
};

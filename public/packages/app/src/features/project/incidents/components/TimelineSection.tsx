import { StoreState } from "@store/types";
import { Card, Link } from "@traceo/ui";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import IncidentTimelineChart from "../../../../core/components/Charts/Incidents/IncidentTimelineChart";

export const TimelineSection = () => {
  const { id, iid } = useParams();
  const { groupedEvents, isLoading } = useSelector((state: StoreState) => state.groupedEvents);

  const navigate = useNavigate();

  return (
    <Card
      title="Timeline"
      className="h-auto"
      extra={
        <Link
          onClick={() => navigate(`/project/${id}/incidents/${iid}/analytics`)}
          className="text-xs font-semibold"
        >
          More
        </Link>
      }
    >
      <IncidentTimelineChart isLoading={isLoading} events={groupedEvents} />
    </Card>
  );
};

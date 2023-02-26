import { StoreState } from "@store/types";
import { Card, Link } from "@traceo/ui";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IncidentTimelinePlot } from "../../../../core/components/Plots";

export const TimelineSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  const { application } = useSelector((state: StoreState) => state.application);

  const navigate = useNavigate();

  return (
    <Card
      title="Timeline"
      className="h-auto"
      extra={
        <Link
          onClick={() => navigate(`/app/${application.id}/incidents/${incident.id}/analytics`)}
          className="text-xs font-semibold"
        >
          More
        </Link>
      }
    >
      <IncidentTimelinePlot errors={incident?.errorsDetails} />
    </Card>
  );
};

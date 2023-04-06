import { StoreState } from "@store/types";
import { useSelector } from "react-redux";

export const useIncidentSelector = () => {
  const { incident, isLoading } = useSelector((state: StoreState) => state.incident);
  const { comments } = useSelector((state: StoreState) => state.comments);
  const { groupedEvents } = useSelector((state: StoreState) => state.groupedEvents);

  return { incident, isLoading, comments, groupedEvents };
};

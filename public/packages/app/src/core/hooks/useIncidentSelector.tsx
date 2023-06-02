import { StoreState } from "@store/types";
import { useSelector } from "react-redux";

export const useIncidentSelector = () => {
  const { incident, isLoading } = useSelector((state: StoreState) => state.incident);
  const { groupedEvents } = useSelector((state: StoreState) => state.groupedEvents);

  return { incident, isLoading, groupedEvents };
};

import { StoreState } from "../../store/types";
import { useSelector } from "react-redux";

export const useDashboard = () => {
  const state = useSelector((state: StoreState) => state.dashboard);
  return { ...state };
};

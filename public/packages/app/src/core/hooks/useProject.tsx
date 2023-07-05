import { StoreState } from "../../store/types";
import { useSelector } from "react-redux";

export const useProject = () => {
  const state = useSelector((state: StoreState) => state.project);
  return { ...state };
};

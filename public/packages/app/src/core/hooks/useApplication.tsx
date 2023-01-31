import { useSelector } from "react-redux";
import { StoreState } from "../../store/types";

export const useApplication = () => {
  const state = useSelector((state: StoreState) => state.application);
  return { ...state };
};

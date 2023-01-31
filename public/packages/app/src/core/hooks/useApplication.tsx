import { useSelector } from "react-redux";
import { StoreState } from "../../types/store";

export const useApplication = () => {
  const state = useSelector((state: StoreState) => state.application);
  return { ...state };
};

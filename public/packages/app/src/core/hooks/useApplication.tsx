import { StoreState } from "@store/types";
import { useSelector } from "react-redux";

export const useApplication = () => {
  const state = useSelector((state: StoreState) => state.application);
  return { ...state };
};

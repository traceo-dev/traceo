import { useSelector } from "react-redux";
import { StoreState } from "types/store";

export const useApplication = () => {
  const { application, hasFetched } = useSelector(
    (state: StoreState) => state.application
  );

  return { application, hasFetched };
};

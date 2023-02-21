import { cookie } from "../utils/cookie";
import { StoreState } from "@store/types";
import { useSelector } from "react-redux";

export const useUser = () => {
  const { user, isFetched } = useSelector((state: StoreState) => state.user);

  const isLoggedIn = !!cookie.get("traceo_session");

  return {
    ...user,
    isLoggedIn,
    isFetched
  };
};

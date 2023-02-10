import { cookie } from "../utils/cookie";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { useEffect } from "react";
import { useAppDispatch } from "../../store/index";
import { loadSignedInUser } from "src/features/auth/state/actions";

export const useUser = () => {
  const { user, isFetched } = useSelector((state: StoreState) => state.user);

  const isLoggedIn = !!cookie.get("traceo_session");

  return {
    ...user,
    isLoggedIn,
    isFetched
  };
};

import { cookie } from "../utils/cookie";
import { useSelector } from "react-redux";
import { StoreState } from "../../store/types";

export const useAccount = () => {
  const { account } = useSelector((state: StoreState) => state.account);

  const isLoggedIn = !!cookie.get("traceo_session");

  return {
    ...account,
    isLoggedIn
  };
};

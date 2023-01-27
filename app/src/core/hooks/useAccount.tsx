import { cookie } from "core/utils/cookie";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";

export const useAccount = () => {
  const { account } = useSelector((state: StoreState) => state.account);

  const isLoggedIn = !!cookie.get("traceo_session");

  return {
    ...account,
    isLoggedIn
  };
};

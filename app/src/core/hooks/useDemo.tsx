import { useSelector } from "react-redux";
import { StoreState } from "../../types/store";

export const useDemo = () => {
  const { account } = useSelector((state: StoreState) => state.account);

  const isDemoEnv = process.env.REACT_APP_DEMO === "true";
  const isAdmin = account.isAdmin;

  const isDemo = isDemoEnv && !isAdmin;

  return { isDemo };
};

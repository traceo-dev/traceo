import { useSelector } from "react-redux";
import { StoreState } from "types/store";

export const useAccount = () => {
  const { account } = useSelector((state: StoreState) => state.account);
  return account;
};

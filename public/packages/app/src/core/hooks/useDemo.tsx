import { useAccount } from "./useAccount";

export const useDemo = () => {
  const account = useAccount();

  const isDemoEnv = process.env.REACT_APP_DEMO === "true";
  const isAdmin = account.isAdmin;

  const isDemo = isDemoEnv && !isAdmin;

  return { isDemo };
};

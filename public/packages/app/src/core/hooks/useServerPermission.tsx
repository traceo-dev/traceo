import { useAccount } from "./useAccount";

export const useServerPermission = () => {
  const account = useAccount();

  const isAdmin = account.isAdmin;

  return { isAdmin };
};

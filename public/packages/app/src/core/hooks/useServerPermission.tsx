import { useUser } from "./useUser";

export const useServerPermission = () => {
  const user = useUser();

  const isAdmin = user.isAdmin;

  return { isAdmin };
};

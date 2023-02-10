import { userUser } from "./useUser";

export const useServerPermission = () => {
  const user = userUser();

  const isAdmin = user.isAdmin;

  return { isAdmin };
};

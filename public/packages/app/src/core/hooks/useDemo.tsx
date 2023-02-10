import { userUser } from "./useUser";

export const useDemo = () => {
  const user = userUser();

  const isDemoEnv = process.env.REACT_APP_DEMO === "true";
  const isAdmin = user.isAdmin;

  const isDemo = isDemoEnv && !isAdmin;

  return { isDemo };
};

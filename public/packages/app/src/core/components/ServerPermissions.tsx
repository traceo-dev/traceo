import { userUser } from "../hooks/useUser";
import { FC } from "react";

const ServerPermissions: FC = ({ children }) => {
  const user = userUser();

  const isAdmin = user.isAdmin;
  if (isAdmin) {
    return <>{children}</>;
  }

  return null;
};

export default ServerPermissions;

import { useUser } from "../hooks/useUser";
import { FC } from "react";

const ServerPermissions: FC = ({ children }) => {
  const user = useUser();

  const isAdmin = user.isAdmin;
  if (isAdmin) {
    return <>{children}</>;
  }

  return null;
};

export default ServerPermissions;

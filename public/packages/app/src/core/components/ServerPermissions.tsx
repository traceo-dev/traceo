import { useUser } from "../hooks/useUser";
import { FC, Fragment } from "react";

const ServerPermissions: FC = ({ children }) => {
  const user = useUser();

  const isAdmin = user.isAdmin;
  if (isAdmin) {
    return <Fragment>{children}</Fragment>;
  }

  return null;
};

export default ServerPermissions;

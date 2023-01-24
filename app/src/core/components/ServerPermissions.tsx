import { useAccount } from "core/hooks/useAccount";
import { FC } from "react";

const ServerPermissions: FC = ({ children }) => {
  const account = useAccount();

  const isAdmin = account.isAdmin;
  if (isAdmin) {
    return <>{children}</>;
  }

  return null;
};

export default ServerPermissions;

import { useAccount } from "core/hooks/useAccount";
import { FC, ReactNode } from "react";

interface PermissionsProps {
  children: ReactNode;
}

const ServerPermissions: FC<PermissionsProps> = ({ children }) => {
  const account = useAccount();

  const isAdmin = account.isAdmin;
  if (isAdmin) {
    return <>{children}</>;
  }

  return null;
};

export default ServerPermissions;

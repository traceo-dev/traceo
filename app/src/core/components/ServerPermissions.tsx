import { useDemo } from "core/hooks/useDemo";
import { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../types/store";

interface PermissionsProps {
  children: ReactNode;
}

const ServerPermissions: FC<PermissionsProps> = ({ children }) => {
  const { account } = useSelector((state: StoreState) => state.account);
  const { isDemo } = useDemo();

  const isAdmin = account.isAdmin;
  if (isAdmin && !isDemo) {
    return <>{children}</>;
  }

  return null;
};

export default ServerPermissions;

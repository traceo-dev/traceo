import { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../types/store";

interface PermissionsProps {
  children: ReactNode;
}

const ServerPermissions: FC<PermissionsProps> = ({ children }) => {
  const { account } = useSelector((state: StoreState) => state.account);

  const isAdmin = account.isAdmin;
  if (isAdmin) {
    return <>{children}</>;
  }

  return null;
};

export default ServerPermissions;

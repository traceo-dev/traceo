import { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { MEMBER_STATUS } from "src/types/application";
import { StoreState } from "src/types/store";

interface PermissionsProps {
  children: ReactNode;
  statuses: MEMBER_STATUS[];
}

const Permissions: FC<PermissionsProps> = ({ statuses, children }) => {
  const { application } = useSelector((state: StoreState) => state.application);

  const status = application.member.status;
  if (status && statuses.includes(status)) {
    return <>{children}</>;
  }

  return null;
};

export default Permissions;

import { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { MemberRole } from "../../types/application";
import { StoreState } from "../../types/store";

interface PermissionsProps {
  children: ReactNode;
  statuses: MemberRole[];
}

export const Permissions: FC<PermissionsProps> = ({ statuses, children }) => {
  const { application } = useSelector((state: StoreState) => state.application);

  const status = application.member.role;
  if (status && statuses.includes(status)) {
    return <>{children}</>;
  }

  return null;
};

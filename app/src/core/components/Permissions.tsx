import { useApplication } from "core/hooks/useApplication";
import { FC, ReactNode } from "react";
import { MemberRole } from "../../types/application";

interface PermissionsProps {
  children: ReactNode;
  statuses: MemberRole[];
}

export const Permissions: FC<PermissionsProps> = ({ statuses, children }) => {
  const { application } = useApplication();

  const status = application.member.role;
  if (status && statuses.includes(status)) {
    return <>{children}</>;
  }

  return null;
};

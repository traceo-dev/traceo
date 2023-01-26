import { useApplication } from "core/hooks/useApplication";
import { FC, ReactNode } from "react";
import { MemberRole } from "../../types/application";

interface PermissionsProps {
  children: ReactNode;
  statuses: MemberRole[];
}

export const Permissions: FC<PermissionsProps> = ({ statuses, children }) => {
  const { permission } = useApplication();

  if (permission && statuses.includes(permission)) {
    return <>{children}</>;
  }

  return null;
};

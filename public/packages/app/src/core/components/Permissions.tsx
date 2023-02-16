import { useApplication } from "../hooks/useApplication";
import { FC, ReactNode } from "react";
import { MemberRole } from "@traceo/types";

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

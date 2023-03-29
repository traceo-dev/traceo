import { useConfig } from "../contexts/ConfigsContextProvider";
import { useProject } from "../hooks/useProject";
import { MemberRole } from "@traceo/types";
import { FC, ReactNode } from "react";

interface PermissionsProps {
  children: ReactNode;
  statuses: MemberRole[];
}

export const Permissions: FC<PermissionsProps> = ({ statuses, children }) => {
  const { permission } = useProject();
  const configs = useConfig();

  const isDemo = !configs.demoMode && !configs.user.isAdmin;

  if (permission && statuses.includes(permission) && !isDemo) {
    return <>{children}</>;
  }

  return null;
};

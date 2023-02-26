import { useConfig } from "../contexts/ConfigsContextProvider";
import { useApplication } from "../hooks/useApplication";
import { MemberRole } from "@traceo/types";
import { FC, ReactNode } from "react";

interface PermissionsProps {
  children: ReactNode;
  statuses: MemberRole[];
}

export const Permissions: FC<PermissionsProps> = ({ statuses, children }) => {
  const { permission } = useApplication();
  const configs = useConfig();

  const isDemo = !configs.demoMode && !configs.user.isAdmin;

  if (permission && statuses.includes(permission) && !isDemo) {
    return <>{children}</>;
  }

  return null;
};

import { useApplication } from "../hooks/useApplication";
import { FC, ReactNode } from "react";
import { MemberRole } from "@traceo/types";
import { useConfig } from "../contexts/ConfigsContextProvider";

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

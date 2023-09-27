import { useProject } from "./useProject";
import { MemberRole } from "@traceo/types";

export const useMemberRole = () => {
  const { project, permission } = useProject();

  const initialState = {
    isViewer: true,
    admin: true,
    isMaintainer: true
  };

  if (!project || !permission) {
    return initialState;
  }

  const isViewer = permission === MemberRole.VIEWER;
  const isAdmin = permission === MemberRole.ADMINISTRATOR;
  const isMaintainer = permission === MemberRole.MAINTAINER;

  return {
    isViewer,
    isAdmin,
    isMaintainer
  };
};

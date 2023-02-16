import { MemberRole } from "@traceo/types";
import { useApplication } from "./useApplication";

export const useMemberRole = () => {
  const { application, permission } = useApplication();

  const initialState = {
    isViewer: true,
    isAdmin: true,
    isMaintainer: true
  };

  if (!application || !permission) {
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

import { MemberRole } from "../../types/application";
import { useApplication } from "./useApplication";

export const useMemberRole = () => {
  const { application } = useApplication();

  const initialState = {
    isViewer: true,
    isAdmin: true,
    isMaintainer: true
  };

  if (!application || !application?.member) {
    return initialState;
  }

  const isViewer = application.member.role === MemberRole.VIEWER;
  const isAdmin = application.member.role === MemberRole.ADMINISTRATOR;
  const isMaintainer = application.member.role === MemberRole.MAINTAINER;

  return {
    isViewer,
    isAdmin,
    isMaintainer
  };
};

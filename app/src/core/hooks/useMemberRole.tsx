import { useSelector } from "react-redux";
import { MemberRole } from "../../types/application";
import { StoreState } from "../../types/store";

export const useMemberRole = () => {
  const { application } = useSelector((state: StoreState) => state.application);

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

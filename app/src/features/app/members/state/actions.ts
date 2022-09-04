import { notify } from "src/core/utils/notify";
import { handleStatus } from "src/core/utils/response";
import api, { ApiQueryParams } from "src/core/lib/api";
import { ApiResponse } from "src/types/api";
import { ThunkResult } from "src/types/store";
import { ApplicationMember, ApplicationMemberUpdateProps } from "src/types/application";
import { membersLoaded } from "./reducers";

export const loadMembers = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const application = getStore().application.application;
    if (!query) {
      query = {
        id: application.id
      };
    }

    const members = await api.get<ApplicationMember[]>("/api/amr/members", query);
    dispatch(membersLoaded(members));
  };
};

export const addMember = ({ email }: { email: string }): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const application = getStore().application.application;
    const response: ApiResponse<string> = await api.post("/api/amr/application/add", {
      email,
      appId: application.id
    });

    if (handleStatus(response.status) === "success") {
      notify.success("Invited to application.");
      dispatch(loadMembers());
    } else {
      notify.error(response.message);
    }
  };
};

export const updateMember = (update: ApplicationMemberUpdateProps): ThunkResult<void> => {
  return async (dispatch) => {
    await api.patch("/api/amr/application/member", update);
    dispatch(loadMembers());
  };
};

export const removeMember = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    await api.delete("/api/amr/application/member", { id });
    dispatch(loadMembers());
    notify.success("Member removed from app.");
  };
};

import { notify } from "../../../../core/utils/notify";
import { handleStatus } from "../../../../core/utils/response";
import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ApiResponse } from "../../../../types/api";
import { ThunkResult } from "../../../../types/store";
import {
  AddAccountToApplication,
  ApplicationMember,
  ApplicationMemberUpdateProps
} from "../../../../types/application";
import { membersLoaded } from "./reducers";

export const loadMembers = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const application = getStore().application.application;
    if (!query?.id || !application) {
      return;
    }

    const members = await api.get<ApplicationMember[]>("/api/amr/members", query);
    dispatch(membersLoaded(members));
  };
};

export const addMember = (props: AddAccountToApplication): ThunkResult<void> => {
  return async (dispatch) => {
    const response: ApiResponse<string> = await api.post(
      "/api/amr/application/add",
      props
    );
    if (handleStatus(response.status) === "success") {
      notify.success("Added to application.");
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

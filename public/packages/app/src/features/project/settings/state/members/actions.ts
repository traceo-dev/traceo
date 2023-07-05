import api, { ApiQueryParams } from "../../../../../core/lib/api";
import { ThunkResult } from "../../../../../store/types";
import { ProjectMember, ApiResponse } from "@traceo/types";
import { membersLoaded } from "./reducers";

export const loadMembers = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const project = getStore().project.project;
    const { data } = await api.get<ApiResponse<ProjectMember[]>>("/api/member/search", {
      ...query,
      id: project?.id
    });
    dispatch(membersLoaded(data));
  };
};

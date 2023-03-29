import api, { ApiQueryParams } from "../../../../../core/lib/api";
import { membersLoaded } from "./reducers";
import { ThunkResult } from "@store/types";
import { ProjectMember, ApiResponse } from "@traceo/types";

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

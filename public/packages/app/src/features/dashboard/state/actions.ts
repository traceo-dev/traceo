import api from "../../../core/lib/api";
import { projectsLoaded } from "./reducers";
import { ThunkResult } from "@store/types";
import { MemberProject, SearchProjectQueryParams, ApiResponse } from "@traceo/types";

export const loadProjects = (query?: SearchProjectQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const user = getStore().user.user;
    if (!query) {
      query = {
        order: "DESC",
        sortBy: "lastEventAt"
      };
    }

    const { data } = await api.get<ApiResponse<MemberProject[]>>("/api/member/projects", {
      userId: query?.userId || user?.id,
      ...query
    });
    dispatch(projectsLoaded(data));
  };
};

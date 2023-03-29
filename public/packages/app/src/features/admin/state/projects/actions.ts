import api, { ApiQueryParams } from "../../../../core/lib/api";
import { projectsLoaded } from "./reducers";
import { ThunkResult } from "@store/types";
import { IProject, ApiResponse } from "@traceo/types";

export const loadInstanceProjects = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch) => {
    if (!query?.sortBy) {
      query = {
        sortBy: "createdAt",
        order: "DESC"
      };
    }
    const { data } = await api.get<ApiResponse<IProject[]>>(
      "/api/projects/search",
      query
    );
    dispatch(projectsLoaded(data));
  };
};

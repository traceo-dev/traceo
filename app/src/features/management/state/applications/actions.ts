import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "../../../../types/store";
import { serverApplicationLoaded, serverApplicationsLoaded } from "./reducers";
import { Application } from "../../../../types/application";
import { ApiResponse } from "types/api";

export const loadServerApplications = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch) => {
    if (!query?.sortBy) {
      query = {
        sortBy: "createdAt",
        order: "DESC"
      };
    }
    const { data } = await api.get<ApiResponse<Application[]>>("/api/application/all", query);
    dispatch(serverApplicationsLoaded(data));
  };
};

export const loadServerApplication = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<Application>>("/api/application", { id });
    dispatch(serverApplicationLoaded(data));
  };
};

export const updateServerApplication = (name: string): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const { application } = getStore().serverApplications;
    await api.patch("/api/application", {
      id: application.id,
      name
    });
    dispatch(loadServerApplication(application.id));
  }
}

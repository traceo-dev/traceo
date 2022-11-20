import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "../../../../types/store";
import { serverApplicationLoaded, serverApplicationsLoaded } from "./reducers";
import { Application } from "../../../../types/application";

export const loadServerApplications = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch) => {
    if (!query?.sortBy) {
      query = {
        sortBy: "createdAt",
        order: "DESC"
      };
    }
    const accounts = await api.get<Application[]>("/api/application/all", query);
    dispatch(serverApplicationsLoaded(accounts));
  };
};

export const loadServerApplication = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    const application = await api.get<Application>("/api/application", { id });
    dispatch(serverApplicationLoaded(application));
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

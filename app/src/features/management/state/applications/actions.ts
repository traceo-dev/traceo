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

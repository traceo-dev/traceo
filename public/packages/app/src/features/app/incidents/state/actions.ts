import { ApiResponse, IComment, IIncident } from "@traceo/types";
import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "../../../../store/types";
import { incidentCommentsLoaded, incidentLoaded, incidentsLoaded, resetIncidentState } from "./reducers";

export const loadIncidents = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const application = getStore().application.application;
    if (!query) {
      query = {
        id: application.id,
        order: "DESC",
        sortBy: "lastError"
      };
    }

    const { data } = await api.get<ApiResponse<IIncident[]>>("/api/incidents", query);
    dispatch(incidentsLoaded(data));
  };
};

export const loadIncident = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    if (!id) {
      return;
    }

    const { data } = await api.get<ApiResponse<IIncident>>(`/api/incidents/${id}`);
    dispatch(incidentLoaded(data));
  };
};

export const loadIncidentComments = (): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const incident = getStore().incident.incident;
    if (!incident.id) {
      return;
    }

    const { data } = await api.get<ApiResponse<IComment[]>>("/api/comments", {
      id: incident.id,
      sortBy: "createdAt",
      order: "ASC"
    });
    dispatch(incidentCommentsLoaded(data));
  };
};

export const updateIncident = (update: any): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const incident = getStore().incident.incident;
    await api.patch(`/api/incidents/${incident.id}`, update);
    dispatch(loadIncident(incident.id));
  };
};

import api, { ApiQueryParams } from "../../../../core/lib/api";
import { incidentCommentsLoaded, incidentEventsLoaded, incidentLoaded, incidentsLoaded } from "./reducers";
import { ThunkResult } from "@store/types";
import { ApiResponse, IComment, IEvent, IIncident } from "@traceo/types";

export const loadIncidents = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const project = getStore().project.project;
    if (!query) {
      query = {
        id: project.id,
        order: "DESC",
        sortBy: "lastEventAt"
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
    dispatch(loadIncidentEvents(id));
    // load also comments here?
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

export const loadIncidentEvents = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<IEvent[]>>(`/api/event/incident/${id}`);
    dispatch(incidentEventsLoaded(data));
  }
}

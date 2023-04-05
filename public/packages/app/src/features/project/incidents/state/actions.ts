import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "@store/types";
import { ApiResponse, IComment, IEvent, IIncident, PlotData } from "@traceo/types";
import { beginCommentsFetch, setIncidentComments } from "./slices/comments.slice";
import { beginEventsFetch, setIncidentEvents } from "./slices/events.slice";
import { beginIncidentFetch, setIncident } from "./slices/incident.slice";
import { beginIncidentsFetch, setIncidents } from "./slices/incidents.slice";
import { beginGroupedEventsFetch, setGroupedEvents } from "./slices/grouped-events.slice";

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

    dispatch(beginIncidentsFetch());
    const { data } = await api.get<ApiResponse<IIncident[]>>("/api/incidents", query);
    dispatch(setIncidents(data));
  };
};

export const loadIncident = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    if (!id) {
      return;
    }

    dispatch(beginIncidentFetch());
    const { data } = await api.get<ApiResponse<IIncident>>(`/api/incidents/${id}`);
    dispatch(setIncident(data));
    dispatch(loadGroupedEvents());
  };
};

export const loadIncidentComments = (): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const incident = getStore().incident.incident;
    if (!incident.id) {
      return;
    }

    dispatch(beginCommentsFetch());
    const { data } = await api.get<ApiResponse<IComment[]>>("/api/comments", {
      id: incident.id,
      sortBy: "createdAt",
      order: "ASC"
    });
    dispatch(setIncidentComments(data));
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
    dispatch(beginEventsFetch());
    const { data } = await api.get<ApiResponse<IEvent[]>>(`/api/event/incident/${id}`);
    dispatch(setIncidentEvents(data));
  }
}

export const loadGroupedEvents = (): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const incident = getStore().incident.incident;

    dispatch(beginGroupedEventsFetch());
    const { data } = await api.get<ApiResponse<PlotData[]>>(`/api/event/incident/${incident.id}/grouped`);
    dispatch(setGroupedEvents(data));
  }
}

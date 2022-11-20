import { ApiResponse } from "../../../../types/api";
import api, { ApiQueryParams } from "../../../../core/lib/api";
import { Comment } from "../../../../types/comments";
import { Incident } from "../../../../types/incidents";
import { ThunkResult } from "../../../../types/store";
import { incidentCommentsLoaded, incidentLoaded, incidentsLoaded } from "./reducers";

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

    const { data } = await api.get<ApiResponse<Incident[]>>("/api/incidents", query);
    dispatch(incidentsLoaded(data));
  };
};

export const loadIncident = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    if (!id) {
      return;
    }

    const { data } = await api.get<ApiResponse<Incident>>(`/api/incidents/${id}`);
    dispatch(incidentLoaded(data));
  };
};

export const loadIncidentComments = (): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const incident = getStore().incident.incident;
    if (!incident.id) {
      return;
    }

    const { data } = await api.get<ApiResponse<Comment[]>>("/api/comments", {
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

interface BatchUpdateProps {
  status: string;
  releaseId: string;
}

export const batchUpdate = ({
  incidentsIds,
  update
}: {
  incidentsIds: string[];
  update: BatchUpdateProps;
}): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    if (!incidentsIds) {
      return;
    }

    const application = getStore().application.application;
    if (!application) {
      return;
    }

    await api.post("/api/incidents/batch", {
      incidentsIds,
      ...update
    });
    dispatch(loadIncidents());
  };
};

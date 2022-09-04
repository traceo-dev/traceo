import { notify } from "src/core/utils/notify";
import api, { ApiQueryParams } from "src/core/lib/api";
import { Comment } from "src/types/comments";
import { Incident } from "src/types/incidents";
import { ThunkResult } from "src/types/store";
import { incidentCommentsLoaded, incidentLoaded, incidentsLoaded } from "./reducers";

export const loadIncidents = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const application = getStore().application.application;
    if (!query) {
      query = {
        id: application.id,
        order: "DESC",
        sortBy: "lastOccur"
      };
    }

    const incidents = await api.get<Incident[]>("/api/incidents", query);
    dispatch(incidentsLoaded(incidents));
  };
};

export const loadIncident = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    if (!id) {
      return;
    }

    const incident = await api.get<Incident>(`/api/incidents/${id}`);
    dispatch(incidentLoaded(incident));
  };
};

export const loadIncidentComments = (): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const incident = getStore().incident.incident;
    if (!incident.id) {
      return;
    }

    const comments = await api.get<Comment[]>("/api/comments", {
      id: incident.id,
      sortBy: "createdAt",
      order: "ASC"
    });
    dispatch(incidentCommentsLoaded(comments));
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
    notify.success("Incidents updated");
  };
};

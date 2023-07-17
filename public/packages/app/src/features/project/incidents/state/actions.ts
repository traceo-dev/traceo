import api from "../../../../core/lib/api";
import { ThunkResult } from "../../../../store/types";
import { isEmptyObject } from "../../../../core/utils/object";
import { ApiResponse, IIncident, PlotData } from "@traceo/types";
import { beginIncidentFetch, endIncidentFetch, setIncident } from "./slices/incident.slice";
import { beginGroupedEventsFetch, setGroupedEvents } from "./slices/grouped-events.slice";

export const loadIncident = (id: string): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    if (!id) {
      return;
    }

    const currentIncident = getStore().incident.incident;
    if (!currentIncident || isEmptyObject(currentIncident)) {
      // due to UX we shouldn't show loading indicator on already fetched incident
      // data is fetching in background without loading indicator
      dispatch(beginIncidentFetch());
    }

    const { data } = await api.get<ApiResponse<IIncident>>(`/api/incidents/${id}`);
    dispatch(setIncident(data));
    dispatch(loadGroupedEvents());

    dispatch(endIncidentFetch());
  };
};

export const updateIncident = (update: any): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const incident = getStore().incident.incident;
    await api.patch(`/api/incidents/${incident.id}`, update);
    dispatch(loadIncident(incident.id));
  };
};

export const loadGroupedEvents = (): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const incident = getStore().incident.incident;
    const groupedEvents = getStore().groupedEvents.groupedEvents;

    if (!groupedEvents) {
      dispatch(beginGroupedEventsFetch());
    }

    const { data } = await api.get<ApiResponse<PlotData[]>>(
      `/api/event/incident/${incident.id}/grouped`
    );
    dispatch(setGroupedEvents(data));
  };
};

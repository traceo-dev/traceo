import api from "../../../core/lib/api";
import { applicationLoaded } from "./reducers";
import {
  CreateApplicationProps,
  UpdateApplicationProps,
  Application
} from "../../../types/application";
import { ThunkResult } from "../../../types/store";
import { loadApplications } from "../../../features/dashboard/state/actions";
import { loadServerApplications } from "../../../features/management/state/applications/actions";

export const loadApplication = (applicationId?: any): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    if (!applicationId) {
      const application = getStore().application.application;

      if (!application) {
        return;
      }

      applicationId = application.id;
    }

    if (!applicationId) {
      return;
    }

    const application = await api.get<Application>("/api/amr/application", {
      id: applicationId
    });
    dispatch(applicationLoaded(application));
  };
};

export const createApplication = (
  body: CreateApplicationProps,
  isAdmin?: boolean
): ThunkResult<void> => {
  return async (dispatch) => {
    await api.post("/api/application", body);
    if (isAdmin) {
      dispatch(loadServerApplications());
      return;
    }

    dispatch(loadApplications());
  };
};

export const updateAplication = (body: UpdateApplicationProps): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const application = getStore().application.application;
    if (!application) {
      return;
    }

    await api.patch("/api/application", {
      id: application.id,
      ...body
    });
    dispatch(loadApplication());
  };
};

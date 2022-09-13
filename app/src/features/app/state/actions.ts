import api from "../../../core/lib/api";
import { applicationLoaded } from "./reducers";
import {
  CreateApplicationProps,
  UpdateApplicationProps,
  Application
} from "../../../types/application";
import { ThunkResult } from "../../../types/store";
import { notify } from "../../../core/utils/notify";
import { ApiResponse } from "../../../types/api";
import { handleStatus } from "../../../core/utils/response";
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
    const response: { id: string } = await api.post("/api/application", body);
    if (response.id) {
      if (isAdmin) {
        dispatch(loadServerApplications());
      } else {
        dispatch(loadApplications());
      }
      notify.success("Application created");
    } else {
      notify.error("Error. Try again later.");
    }
  };
};

export const updateAplication = (body: UpdateApplicationProps): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const application = getStore().application.application;
    if (!application) {
      return;
    }

    const response: ApiResponse<string> = await api.patch("/api/application", {
      id: application.id,
      ...body
    });

    if (handleStatus(response.status) === "success") {
      dispatch(loadApplication());
      notify.success("Application updated");
    } else {
      notify.error(response.message);
    }
  };
};

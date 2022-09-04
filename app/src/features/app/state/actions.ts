import api from "src/core/lib/api";
import { applicationLoaded } from "./reducers";
import {
  CreateApplicationProps,
  UpdateApplicationProps,
  Application
} from "src/types/application";
import { ThunkResult } from "src/types/store";
import { notify } from "src/core/utils/notify";
import { ApiResponse } from "src/types/api";
import { handleStatus } from "src/core/utils/response";
import { loadApplications } from "src/features/dashboard/state/actions";

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

    const application = await api.get<Application>("/api/application", {
      id: applicationId
    });
    dispatch(applicationLoaded(application));
  };
};

export const createApplication = (body: CreateApplicationProps): ThunkResult<void> => {
  return async (dispatch) => {
    const response: { id: string } = await api.post("/api/application", body);
    if (response.id) {
      dispatch(loadApplications());
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

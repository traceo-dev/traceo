import api from "../../../../core/lib/api";
import { loadApplications } from "../../../dashboard/state/actions";
import { loadServerApplications } from "../../../management/state/applications/actions";
import { ApiResponse } from "../../../../types/api";
import { Application, CreateApplicationProps, MemberRole, UpdateApplicationProps } from "../../../../types/application";
import { ThunkResult } from "../../../../types/store";
import { navbarState } from "../navbar/reducers";
import { applicationLoaded, applicationPermission, resetApplicationState } from "./reducers";

export type LoadApplicationType = {
  id?: string
}

export const initApplication = (props: LoadApplicationType): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(resetApplicationState());
    dispatch(loadPermission({ id: props.id }));
    dispatch(navbarState({ hidden: false }));
    dispatch(loadApplication({ id: props.id }));
  }
}

export const loadApplication = (props?: LoadApplicationType): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    let currId = props.id;
    if (!props.id) {
      currId = getStore().application.application.id
    };

    const { data } = await api.get<ApiResponse<Application>>("/api/applications", {
      id: currId
    });
    dispatch(applicationLoaded(data));
  };
};

export const loadPermission = (props?: LoadApplicationType): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const { data } = await api.get<ApiResponse<{
        role: MemberRole
      }>>("/api/amr/permission", {
        id: props.id
      });
      dispatch(applicationPermission(data.role));
    } catch (err) {
      //
    }
  }
}

export const createApplication = (
  body: CreateApplicationProps,
  isAdmin?: boolean
): ThunkResult<void> => {
  return async (dispatch) => {
    // TODO: split this logic
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
    dispatch(loadApplication({
      id: application.id
    }));
  };
};

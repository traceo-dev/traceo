import api from "../../../../core/lib/api";
import { ApiResponse, IApplication, MemberRole, UpdateApplicationProps } from "@traceo/types";
import { ThunkResult } from "@store/types";
import { navbarState } from "../../../../store/internal/navbar/reducers";
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
    let currId = props?.id;
    if (!props?.id) {
      currId = getStore().application.application.id
    };

    const { data } = await api.get<ApiResponse<IApplication>>("/api/applications", {
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
      }>>("/api/member/permission", {
        id: props.id
      });
      dispatch(applicationPermission(data.role));
    } catch (err) {
      //
    }
  }
}

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

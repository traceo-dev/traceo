import api from "../../../../core/lib/api";
import { beginProjectFetch, setPermission, setProject, resetProjectState } from "./reducers";
import { ThunkResult } from "@store/types";
import { ApiResponse, IProject, MemberRole, UpdateProjectProps } from "@traceo/types";

export type LoadApplicationType = {
  id?: string;
};

export const initProject = (props: LoadApplicationType): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(resetProjectState());

    dispatch(beginProjectFetch());
    dispatch(loadPermission({ id: props.id }));
    dispatch(loadProject({ id: props.id }));
  };
};

export const loadProject = (props?: LoadApplicationType): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    let currId = props?.id;
    if (!props?.id) {
      currId = getStore().project.project.id;
    }

    const { data } = await api.get<ApiResponse<IProject>>("/api/project", {
      id: currId
    });

    dispatch(setProject(data));
  };
};

export const loadPermission = (props?: LoadApplicationType): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const { data } = await api.get<
        ApiResponse<{
          role: MemberRole;
        }>
      >("/api/member/permission", {
        id: props.id
      });
      dispatch(setPermission(data.role));
    } catch (err) {
      //
    }
  };
};

export const updateAplication = (body: UpdateProjectProps): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const project = getStore().project.project;
    if (!project) {
      return;
    }

    await api.patch("/api/project", {
      id: project.id,
      ...body
    });
    dispatch(
      loadProject({
        id: project.id
      })
    );
  };
};

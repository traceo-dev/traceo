import api from "../../../../core/lib/api";
import { ThunkResult } from "../../../../store/types";
import { beginProjectFetch, setPermission, setProject, resetProjectState, setDashboards, endProjectFetch } from "./reducers";
import { ApiResponse, Dashboard, IProject, MemberRole, UpdateProjectProps } from "@traceo/types";

export type LoadProjectType = {
  id?: string;
};

export const initProject = (props: LoadProjectType): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(resetProjectState());

    const promises = [
      dispatch(beginProjectFetch()),

      dispatch(loadPermission({ id: props.id })),
      dispatch(loadDashboards({ id: props.id })),
      dispatch(loadProject({ id: props.id })),

      // dispatch(endProjectFetch())
    ];

    await Promise.allSettled(promises);
  };
};

export const loadProject = (props?: LoadProjectType): ThunkResult<void> => {
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

export const loadDashboards = (props: LoadProjectType): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<Dashboard[]>>(`/api/dashboard/project/${props.id}`);
    console.log("dashboards: ", data);
    dispatch(setDashboards(data))
  }
}

type PermissionType = {
  role: MemberRole;
};
export const loadPermission = (props?: LoadProjectType): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const { data } = await api.get<ApiResponse<PermissionType>>("/api/member/permission", {
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

import api from "../../../../core/lib/api";
import { ThunkResult } from "@store/types";
import { ApiResponse, IProject } from "@traceo/types";
import { beginProjectFetch, setProject } from "./reducers";

export const loadProject = (id: string): ThunkResult<void> => {
    return async (dispatch) => {
        dispatch(beginProjectFetch());

        const { data } = await api.get<ApiResponse<IProject>>("/api/project", { id });
        dispatch(setProject(data));
    };
};

import api from "../../../../core/lib/api";
import { ThunkResult } from "@store/types";
import { ApiResponse, Dashboard } from "@traceo/types";
import { beginDashboardFetch, endDashboardFetch, setDashboard } from "./reducers";

export const loadDashboard = (id: string): ThunkResult<void> => {
    return async (dispatch) => {
        if (!id) {
            return;
        }

        dispatch(beginDashboardFetch());

        const { data } = await api.get<ApiResponse<Dashboard>>(`/api/dashboard/${id}`);
        dispatch(setDashboard(data));

        dispatch(endDashboardFetch());
    };
};

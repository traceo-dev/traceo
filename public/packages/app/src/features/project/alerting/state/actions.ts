import { ThunkResult } from "../../../../store/types";
import api from "../../../../core/lib/api";
import { isEmptyObject } from "../../../../core/utils/object";
import { beginAlertFetch, endAlertFetch, setAlert } from "./alert.slice";
import { ApiResponse, IAlert } from "@traceo/types";

export const loadAlert = (id: string): ThunkResult<void> => {
    return async (dispatch, getStore) => {
        if (!id) {
            return;
        }

        const currentAlert = getStore().alert.alert;
        if (!currentAlert || isEmptyObject(currentAlert)) {
            // due to UX we shouldn't show loading indicator on already fetched alert
            // data is fetching in background without loading indicator
            dispatch(beginAlertFetch());
        }

        const { data } = await api.get<ApiResponse<IAlert>>(`/api/alert/${id}`);
        dispatch(setAlert(data));

        dispatch(endAlertFetch());
    };
};

type AlertDto = Omit<IAlert, "recipients"> & {
    recipients: string[];
}

export const updateAlert = (update: Partial<AlertDto>): ThunkResult<void> => {
    return async (dispatch, getStore) => {
        const currentAlert = getStore().alert.alert;
        if (!currentAlert) {
            return;
        }

        await api.patch<ApiResponse<IAlert>>(`/api/alert/${currentAlert.id}`, update);
        dispatch(loadAlert(currentAlert.id));
    }
}

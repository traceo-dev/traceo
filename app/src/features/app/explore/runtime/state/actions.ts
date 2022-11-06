import api from "../../../../../core/lib/api";
import { ThunkResult } from "../../../../../types/store";
import { runtimeLoaded } from "./reducers";

export const loadApplicationRuntime = (): ThunkResult<void> => {
    return async (dispatch, getStore) => {
        const application = getStore().application.application;
        if (!application) {
            return;
        }

        const runtime = await api.get<object>("/api/application/runtime", {
            id: application.id
        });
        dispatch(runtimeLoaded(runtime));
    };
};

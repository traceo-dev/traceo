import api from "src/core/lib/api";
import { ThunkResult } from "src/types/store";
import {
  AccountApplication,
  SearchApplicationQueryParams,
  UpdateAccountApplicationProps
} from "src/types/application";
import { applicationsLoaded } from "./reducers";

export const loadApplications = (
  query?: SearchApplicationQueryParams
): ThunkResult<void> => {
  return async (dispatch) => {
    if (!query) {
      query = {
        order: "ASC",
        sortBy: "application.lastIncidentAt"
      };
    }

    const application = await api.get<AccountApplication[]>(
      "/api/amr/applications",
      query
    );
    dispatch(applicationsLoaded(application));
  };
};

export const updateAccountApplication = (
  body: UpdateAccountApplicationProps
): ThunkResult<void> => {
  return async (dispatch) => {
    await api.patch("/api/amr/application/member", {
      ...body
    });
    dispatch(loadApplications());
  };
};

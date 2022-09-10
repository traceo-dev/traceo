import api from "src/core/lib/api";
import { ThunkResult } from "src/types/store";
import {
  ApplicationMember,
  SearchApplicationQueryParams,
  UpdateAccountApplicationProps
} from "src/types/application";
import { applicationsLoaded } from "./reducers";

export const loadApplications = (
  query?: SearchApplicationQueryParams
): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const account = getStore().account.account;
    if (!query) {
      query = {
        order: "ASC",
        sortBy: "application.lastIncidentAt",
        accountId: account.id
      };
    }

    const application = await api.get<ApplicationMember[]>(
      "/api/amr/applications",
      {
        accountId: query.accountId || account.id,
        ...query
      }
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

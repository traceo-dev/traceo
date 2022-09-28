import api from "../../../core/lib/api";
import { ThunkResult } from "../../../types/store";
import {
  ApplicationMember,
  SearchApplicationQueryParams,
  UpdateAccountApplicationProps
} from "../../../types/application";
import { applicationsLoaded } from "./reducers";

export const loadApplications = (
  query?: SearchApplicationQueryParams
): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const account = getStore().account.account;
    if (!query) {
      query = {
        order: "ASC",
        sortBy: "application.lastIncidentAt"
      };
    }

    const applications = await api.get<ApplicationMember[]>("/api/amr/applications", {
      accountId: query?.accountId || account?.id,
      ...query
    });
    console.log({ applications })
    dispatch(applicationsLoaded(applications));
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

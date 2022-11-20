import api from "../../../core/lib/api";
import { ThunkResult } from "../../../types/store";
import {
  ApplicationMember,
  SearchApplicationQueryParams
} from "../../../types/application";
import { applicationsLoaded } from "./reducers";
import { ApiResponse } from "types/api";

export const loadApplications = (
  query?: SearchApplicationQueryParams
): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const account = getStore().account.account;
    if (!query) {
      query = {
        order: "DESC",
        sortBy: "lastIncidentAt"
      };
    }

    const { data } = await api.get<ApiResponse<ApplicationMember[]>>("/api/amr/applications", {
      accountId: query?.accountId || account?.id,
      ...query
    });
    dispatch(applicationsLoaded(data));
  };
};

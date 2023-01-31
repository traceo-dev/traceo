import api from "../../../core/lib/api";
import { ThunkResult } from "@store/types";
import {
  MemberApplication,
  SearchApplicationQueryParams,
  ApiResponse
} from "@traceo/types";
import { applicationsLoaded } from "./reducers";

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

    const { data } = await api.get<ApiResponse<MemberApplication[]>>("/api/amr/applications", {
      accountId: query?.accountId || account?.id,
      ...query
    });
    dispatch(applicationsLoaded(data));
  };
};

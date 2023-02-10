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
    const user = getStore().user.user;
    if (!query) {
      query = {
        order: "DESC",
        sortBy: "lastIncidentAt"
      };
    }

    const { data } = await api.get<ApiResponse<MemberApplication[]>>("/api/amr/applications", {
      accountId: query?.accountId || user?.id,
      ...query
    });
    dispatch(applicationsLoaded(data));
  };
};

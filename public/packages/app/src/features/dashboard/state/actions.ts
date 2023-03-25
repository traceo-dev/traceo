import api from "../../../core/lib/api";
import { applicationsLoaded } from "./reducers";
import { ThunkResult } from "@store/types";
import { MemberApplication, SearchApplicationQueryParams, ApiResponse } from "@traceo/types";

export const loadApplications = (query?: SearchApplicationQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const user = getStore().user.user;
    if (!query) {
      query = {
        order: "DESC",
        sortBy: "lastEventAt"
      };
    }

    const { data } = await api.get<ApiResponse<MemberApplication[]>>("/api/member/applications", {
      userId: query?.userId || user?.id,
      ...query
    });
    dispatch(applicationsLoaded(data));
  };
};

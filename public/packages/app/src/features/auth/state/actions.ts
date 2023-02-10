import api from "../../../core/lib/api";
import { ApiResponse, IUser } from "@traceo/types";
import { userLoaded } from "./reducers";
import { ThunkResult } from "@store/types";

export const loadSignedInUser = (): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<IUser>>("/api/account");
    dispatch(userLoaded(data));
  };
};

type LogoutAccountType = {
  redirectUrl: string;
}
export const logoutUser = (): ThunkResult<void> => {
  return async () => {
    const { data } = await api.get<ApiResponse<LogoutAccountType>>("/api/auth/logout");
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = !!data.redirectUrl ? data.redirectUrl : "/";
  }
}
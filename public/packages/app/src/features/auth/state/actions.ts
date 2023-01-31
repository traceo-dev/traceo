import api from "../../../core/lib/api";
import { ApiResponse, IAccount } from "@traceo/types";
import { accountLoaded } from "./reducers";
import { ThunkResult } from "../../../store/types";

export const loadAccount = (): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<IAccount>>("/api/account");
    dispatch(accountLoaded(data));
  };
};

type LogoutAccountType = {
  redirectUrl: string;
}
export const logoutAccount = (): ThunkResult<void> => {
  return async () => {
    const { data } = await api.get<ApiResponse<LogoutAccountType>>("/api/auth/logout");
    sessionStorage.clear();
    window.location.href = !!data.redirectUrl ? data.redirectUrl : "/";
  }
}
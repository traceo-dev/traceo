import api from "../../../core/lib/api";
import { ApiResponse } from "../../../types/api";
import { accountLoaded } from "./reducers";
import { Account } from "../../../types/accounts";
import { ThunkResult } from "../../../types/store";

export const loadAccount = (): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<Account>>("/api/account");
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
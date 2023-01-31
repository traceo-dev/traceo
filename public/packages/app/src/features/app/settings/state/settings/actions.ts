import api from "../../../../../core/lib/api";
import { logout } from "../../../../../core/utils/logout";
import { loadAccount } from "../../../../auth/state/actions";
import { IAccount, ApiResponse } from "@traceo/types";
import { ThunkResult } from "../../../../../store/types";

export const updateAccount = (update: Partial<IAccount>): ThunkResult<void> => {
  return async (dispatch) => {
    if (!update) {
      return;
    }

    await api.patch<ApiResponse<unknown>>("/api/account", update);
    dispatch(loadAccount());
  };
};

export const updateAccountPassword = (cred: {
  password: string;
  newPassword: string;
}): ThunkResult<void> => {
  return async () => {
    if (!cred) {
      return;
    }

    await api.post<ApiResponse<string>>("/api/auth/update-password", cred)
      .then((response) => {
        if (response.status === "success") {
          logout();
        }
      });
  };
};

export const deleteAccount = (): ThunkResult<void> => {
  return async () => {
    await api.delete<ApiResponse<string>>("/api/account")
      .then((response) => {
        if (response.status === "success") {
          logout()
        };
      });
  };
};

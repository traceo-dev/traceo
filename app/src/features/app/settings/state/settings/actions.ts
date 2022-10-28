import api from "../../../../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../../../../core/utils/constants";
import { logout } from "../../../../../core/utils/logout";
import { notify } from "../../../../../core/utils/notify";
import { handleStatus } from "../../../../../core/utils/response";
import { loadAccount } from "../../../../../features/auth/state/actions";
import { Account } from "../../../../../types/accounts";
import { ApiResponse } from "../../../../../types/api";
import { ThunkResult } from "../../../../../types/store";
import { loadedDataSource } from "./reducers";

export const updateAccount = (update: Partial<Account>): ThunkResult<void> => {
  return async (dispatch) => {
    if (!update) {
      return;
    }

    try {
      await api.patch("/api/account", update);
      dispatch(loadAccount());

      notify.success("Account has been updated");
    } catch (error) {
      notify.error(TRY_AGAIN_LATER_ERROR);
    }
  };
};

//TODO: make here and in other places with using dispatch to show notifcations
export const updateAccountPassword = (cred: {
  password: string;
  newPassword: string;
}): ThunkResult<void> => {
  return async () => {
    if (!cred) {
      return;
    }

    try {
      const resp: ApiResponse<string> = await api.post("/api/auth/update-password", cred);
      if (handleStatus(resp.status) === "success") {
        notify.success("Password updated successfully.");
        logout();
      } else {
        notify.error(resp.message);
      }
    } catch (error) {
      notify.error(error);
    }
  };
};

export const deleteAccount = (): ThunkResult<void> => {
  return async () => {
    const response: ApiResponse<string> = await api.delete("/api/account");
    const isSuccess = handleStatus(response.status) === "success";
    isSuccess ? logout() : notify.error(response.message);
  };
};

export const loadDataSource = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    const response: ApiResponse<object> = await api.get("/api/datasource", {
      id
    });
    dispatch(loadedDataSource(response));
  }
}
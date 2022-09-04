import { logout } from "src/core/utils/logout";
import { notify } from "src/core/utils/notify";
import { handleStatus } from "src/core/utils/response";
import api from "src/core/lib/api";
import { Account } from "src/types/accounts";
import { ApiResponse } from "src/types/api";
import { ThunkResult } from "src/types/store";
import { loadAccount } from "src/features/auth/state/actions";

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
      notify.error("Account has not been updated. Please try again later.");
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
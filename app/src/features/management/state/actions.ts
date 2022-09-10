import api, { ApiQueryParams } from "src/core/lib/api";
import { ThunkResult } from "src/types/store";
import { serverAccountLoaded, serverAccountsLoaded } from "./reducers";
import { Account, AddAccountProps } from "src/types/accounts";
import { notify } from "src/core/utils/notify";
import { handleStatus } from "src/core/utils/response";
import { ApiResponse } from "src/types/api";

export const loadServerAccounts = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch) => {
    const accounts = await api.get<Account[]>("/api/account/all", query);
    dispatch(serverAccountsLoaded(accounts));
  };
};

export const loadServerAccount = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    const account = await api.get<Account>("/api/account", { id });
    dispatch(serverAccountLoaded(account));
  }
}

export const updateServerAccount = (update: Partial<Account>): ThunkResult<void> => {
  return async (dispatch) => {
    if (!update) {
      return;
    }

    try {
      await api.patch("/api/account", update);
      dispatch(loadServerAccount(update.id));

      notify.success("Account has been updated");
    } catch (error) {
      notify.error("Account has not been updated. Please try again later.");
    }
  };
}

export const addServerAccount = (props: AddAccountProps): ThunkResult<void> => {
  return async (dispatch) => {
    const response: ApiResponse<string> = await api.post("/api/account/new", props);

    if (handleStatus(response.status) === "success") {
      dispatch(loadServerAccounts());
      notify.success("Added to Traceo.");
    } else {
      notify.error(response.message);
    }
  };
};

import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "../../../../types/store";
import { serverAccountLoaded, serverAccountsLoaded } from "./reducers";
import { Account, AddAccountProps } from "../../../../types/accounts";
import { notify } from "../../../../core/utils/notify";
import { handleStatus } from "../../../../core/utils/response";
import { ApiResponse } from "../../../../types/api";
import { TRY_AGAIN_LATER_ERROR } from "core/utils/constants";

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
  };
};

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
      notify.error(TRY_AGAIN_LATER_ERROR);
    }
  };
};

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

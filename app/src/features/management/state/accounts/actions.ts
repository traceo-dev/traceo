import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "../../../../types/store";
import { serverAccountLoaded, serverAccountLoadedAction, serverAccountsLoaded } from "./reducers";
import { Account, AddAccountProps } from "../../../../types/accounts";
import { ApiResponse } from "../../../../types/api";

export const loadServerAccounts = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<Account[]>>("/api/account/all", query);
    dispatch(serverAccountsLoaded(data));
  };
};

export const loadServerAccount = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(serverAccountLoadedAction(false))
    const { data } = await api.get<ApiResponse<Account>>("/api/account", { id });
    dispatch(serverAccountLoaded(data));
    dispatch(serverAccountLoadedAction(true))
  };
};

export const updateServerAccount = (update: Partial<Account>): ThunkResult<void> => {
  return async (dispatch) => {
    if (!update) {
      return;
    }

    await api.patch("/api/account", update);
    dispatch(loadServerAccount(update.id));
  };
};

export const addServerAccount = (props: AddAccountProps): ThunkResult<void> => {
  return async (dispatch) => {
    await api.post("/api/account/new", props);
    dispatch(loadServerAccounts());
  };
};

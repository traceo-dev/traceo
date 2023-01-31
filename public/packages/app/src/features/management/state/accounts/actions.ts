import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "../../../../store/types";
import { serverAccountLoaded, serverAccountLoadedAction, serverAccountsLoaded } from "./reducers";
import { IAccount, AddAccountProps, ApiResponse } from "@traceo/types";

export const loadServerAccounts = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<IAccount[]>>("/api/accounts/search", query);
    dispatch(serverAccountsLoaded(data));
  };
};

export const loadServerAccount = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(serverAccountLoadedAction(false))
    const { data } = await api.get<ApiResponse<IAccount>>("/api/accounts", { id });
    dispatch(serverAccountLoaded(data));
    dispatch(serverAccountLoadedAction(true))
  };
};

export const updateServerAccount = (update: Partial<IAccount>): ThunkResult<void> => {
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

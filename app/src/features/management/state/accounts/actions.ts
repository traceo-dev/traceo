import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "../../../../types/store";
import { serverAccountLoaded, serverAccountsLoaded } from "./reducers";
import { Account, AddAccountProps } from "../../../../types/accounts";

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

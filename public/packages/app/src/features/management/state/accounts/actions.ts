import api, { ApiQueryParams } from "../../../../core/lib/api";
import { ThunkResult } from "@store/types";
import { serveruserLoaded, serveruserLoadedAction, serverAccountsLoaded } from "./reducers";
import { IUser, ApiResponse } from "@traceo/types";

export const loadUsers = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<IUser[]>>("/api/accounts/search", query);
    dispatch(serverAccountsLoaded(data));
  };
};

export const loadServerAccount = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(serveruserLoadedAction(false))
    const { data } = await api.get<ApiResponse<IUser>>("/api/accounts", { id });
    dispatch(serveruserLoaded(data));
    dispatch(serveruserLoadedAction(true))
  };
};

export const updateUser = (update: Partial<IUser>): ThunkResult<void> => {
  return async (dispatch) => {
    if (!update) {
      return;
    }

    await api.patch("/api/account", update);
    dispatch(loadServerAccount(update.id));
  };
};

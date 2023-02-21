import api, { ApiQueryParams } from "../../../../core/lib/api";
import { userFetchedAction, userLoaded, usersLoaded } from "./reducers";
import { ThunkResult } from "@store/types";
import { IUser, ApiResponse } from "@traceo/types";

export const loadUsers = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch) => {
    const { data } = await api.get<ApiResponse<IUser[]>>("/api/users/search", query);
    dispatch(usersLoaded(data));
  };
};

export const loadUser = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(userFetchedAction(false));
    const { data } = await api.get<ApiResponse<IUser>>("/api/users", { id });
    dispatch(userLoaded(data));
    dispatch(userFetchedAction(true));
  };
};

export const updateUser = (update: Partial<IUser>): ThunkResult<void> => {
  return async (dispatch) => {
    if (!update) {
      return;
    }

    await api.patch("/api/user", update);
    dispatch(loadUser(update.id));
  };
};

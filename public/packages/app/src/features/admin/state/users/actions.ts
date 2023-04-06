import api from "../../../../core/lib/api";
import { ThunkResult } from "@store/types";
import { IUser, ApiResponse } from "@traceo/types";
import { beginUserFetch, setUser } from "./reducers";

export const loadUser = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(beginUserFetch());

    const { data } = await api.get<ApiResponse<IUser>>("/api/users", { id });
    dispatch(setUser(data));
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

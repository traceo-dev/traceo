import api from "../../../core/lib/api";
import { ApiResponse } from "../../../types/api";
import jwt from "jwt-decode";
import { accountLoaded } from "./reducers";
import { Account } from "../../../types/accounts";
import { ThunkResult } from "../../../types/store";

export const loadAccount = (): ThunkResult<void> => {
  return async (dispatch) => {
    const token = localStorage.getItem("session");
    const decodedToken = token ? jwt(token) : null;
    if (!token) {
      return;
    }

    const payload = {
      id: decodedToken.id
    };

    const { data } = await api.get<ApiResponse<Account>>("/api/account", payload);
    dispatch(accountLoaded(data));
  };
};

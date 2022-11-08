import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/lib/api";
import { ApiResponse } from "../../../types/api";
import { handleStatus } from "../../../core/utils/response";
import jwt from "jwt-decode";
import { accountLoaded } from "./reducers";
import { Account } from "../../../types/accounts";
import { ThunkResult } from "../../../types/store";
import { dispatch, getState } from "../../../store/store";
import { SignupProps, LoginProps } from "../../../types/auth";

export const loadAccount = (): ThunkResult<void> => {
  return async (dispatch) => {
    const token = localStorage.getItem("session");
    const decodedToken = token ? jwt(token) : null;
    if (!token) {
      return; //TODO: logout, throw error or something like this
    }

    const payload = {
      id: decodedToken.id
    };

    const account = await api.get<Account>("/api/account", payload);
    dispatch(accountLoaded(account));
  };
};

export const signupAccount = createAsyncThunk(
  "auth/register",
  async (credentials: SignupProps, thunkApi) => {
    try {
      const response: ApiResponse<any> = await api.post(
        "/api/auth/register",
        credentials
      );

      const data = response.status;
      const isSuccess = handleStatus(data) === "success";

      if (isSuccess) {
        return { data };
      } else {
        return thunkApi.rejectWithValue(data);
      }
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  }
);

export const loginAccount = createAsyncThunk(
  "auth/login",
  async (credentials: LoginProps, thunkApi) => {
    try {
      const response: { accessToken: string } = await api.post(
        "/api/auth/login",
        credentials
      );
      const token = response?.accessToken;

      if (token) {
        localStorage.setItem("session", token);
        dispatch(loadAccount());
      } else {
        return thunkApi.rejectWithValue(response);
      }
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  }
);

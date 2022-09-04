import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/core/lib/api";
import { ApiResponse } from "src/types/api";
import { handleStatus } from "src/core/utils/response";
import jwt from "jwt-decode";
import { accountLoaded } from "./reducers";
import { Account } from "src/types/accounts";
import { ThunkResult } from "src/types/store";
import { getState } from "src/store/store";
import { SignupProps, LoginProps } from "src/types/auth";

export const loadAccount = (): ThunkResult<void> => {
  return async (dispatch) => {
    const token = localStorage.getItem("session");
    const decodedToken = token ? jwt(token) : null;
    if (!token) {
      return; //TODO: logout, throw error or something like this
    }

    const application = getState().application.application;
    const payload = {
      id: decodedToken.id,
      appId: application.id || null
    };

    const account = await api.get<Account>("/api/amr/account", payload);
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
      } else {
        return thunkApi.rejectWithValue(response);
      }
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  }
);

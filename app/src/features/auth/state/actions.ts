import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/lib/api";
import { ApiResponse } from "../../../types/api";
import jwt from "jwt-decode";
import { accountLoaded } from "./reducers";
import { Account } from "../../../types/accounts";
import { ThunkResult } from "../../../types/store";
import { dispatch } from "../../../store/store";
import { LoginProps } from "../../../types/auth";

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

    const account = await api.get<Account>("/api/account", payload);
    dispatch(accountLoaded(account));
  };
};

// export const signupAccount = createAsyncThunk(
//   "auth/register",
//   async (credentials: SignupProps, thunkApi) => {
//     try {
//       const response: ApiResponse<any> = await api.post(
//         "/api/auth/register",
//         credentials
//       );

//       const data = response.status;
//       const isSuccess = handleStatus(data) === "success";

//       if (isSuccess) {
//         return { data };
//       } else {
//         return thunkApi.rejectWithValue(data);
//       }
//     } catch (error) {
//       thunkApi.rejectWithValue(error);
//     }
//   }
// );

export const loginAccount = createAsyncThunk(
  "auth/login",
  async (credentials: LoginProps, thunkApi) => {
    try {
      const res: ApiResponse<{ accessToken: string }> = await api.post(
        "/api/auth/login",
        credentials
      );

      if (res.status === "success") {
        const token = res.data.accessToken;
        localStorage.setItem("session", token);
        dispatch(loadAccount());
      } else {
        return thunkApi.rejectWithValue(res);
      }
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  }
);

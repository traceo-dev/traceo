import {
  PayloadAction,
} from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { createRootReducer } from "./root";

export type StoreState = ReturnType<ReturnType<typeof createRootReducer>>;

export type ThunkResult<R> = ThunkAction<R, StoreState, undefined, PayloadAction<any>>;

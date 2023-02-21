import { createRootReducer } from "./root";
import { PayloadAction } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";

export type StoreState = ReturnType<ReturnType<typeof createRootReducer>>;

export type ThunkResult<R> = ThunkAction<R, StoreState, undefined, PayloadAction<any>>;

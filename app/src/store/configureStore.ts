import { configureStore as reduxConfigureStore, MiddlewareArray } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { ThunkMiddleware } from "redux-thunk";
import { createRootReducer } from "../core/reducers/root";
import { StoreState } from "../types/store";
import { setStore } from "./store";

export function configureStore() {
  const store = reduxConfigureStore<
    StoreState,
    AnyAction,
    MiddlewareArray<[ThunkMiddleware<StoreState, AnyAction>]>
  >({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
        immutableCheck: false
      }),
    devTools: process.env.NODE_ENV !== "production"
  });

  setStore(store);
  return store;
}

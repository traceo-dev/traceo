import {
  AsyncThunkPayloadCreator,
  AsyncThunkOptions,
  AsyncThunk,
  PayloadAction,
  configureStore,
  createAsyncThunk as createAsyncThunkUntyped
} from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { createRootReducer } from "../core/reducers/root";

export type StoreState = ReturnType<ReturnType<typeof createRootReducer>>;

export type ThunkResult<R> = ThunkAction<R, StoreState, undefined, PayloadAction<any>>;
export type AppDispatch = ReturnType<typeof configureStore>["dispatch"];

// export const useDispatch = () => useDispatchUntyped<AppDispatch>();
// export const useSelector: TypedUseSelectorHook<StoreState> = useSelectorUntyped;

type DefaultThunkApiConfig = { dispatch: AppDispatch; state: StoreState };

export const createAsyncThunk = <
  Returned,
  ThunkArg = void,
  ThunkApiConfig = DefaultThunkApiConfig
>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
  options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>
): AsyncThunk<Returned, ThunkArg, ThunkApiConfig> =>
  createAsyncThunkUntyped(typePrefix, payloadCreator, options);

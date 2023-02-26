// eslint-disable-next-line no-restricted-imports

import { appReducers } from "./root";
import { configureStore as reduxConfigureStore } from "@reduxjs/toolkit";
import { useDispatch as useReduxDispatch } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage";

const slicesToPersist = ["user"];

const encryptionTransform = encryptTransform({
  secretKey: "traceo"
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [encryptionTransform],
  whitelist: slicesToPersist
};

const persistedReducer = persistReducer(persistConfig, appReducers);

export const store = reduxConfigureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
      immutableCheck: false
    })
});

export const persistedRedux = persistStore(store);

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useReduxDispatch<AppDispatch>();

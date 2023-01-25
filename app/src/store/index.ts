import { useDispatch as useReduxDispatch } from 'react-redux';
import { configureStore as reduxConfigureStore } from "@reduxjs/toolkit";
import { appReducers } from "./root";
import storage from "redux-persist/lib/storage";
import {
    persistReducer,
    persistStore
} from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";

const slicesToPersist = ["account", "application"];

const encryptionTransform = encryptTransform({
    secretKey: process.env.REACT_APP_PERSIST_KEY
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    transforms: [encryptionTransform],
    whitelist: slicesToPersist,
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
        }),
});

export const persistedRedux = persistStore(store);

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useReduxDispatch<AppDispatch>();

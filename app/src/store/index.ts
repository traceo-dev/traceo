import { useDispatch as useReduxDispatch } from 'react-redux';
import { configureStore as reduxConfigureStore } from "@reduxjs/toolkit";
import { appReducers } from "./root";
import storage from 'redux-persist/lib/storage';
import {
    persistReducer,
    persistStore
} from 'redux-persist';

const slicesToPersist = ["account", "application"];

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
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

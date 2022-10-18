import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
    dataSource: object;
    hasFetched: boolean;
}

const initialState: SettingsState = {
    dataSource: {},
    hasFetched: false
};

const dataSource = createSlice({
    name: "dataSource",
    initialState: initialState,
    reducers: {
        loadedDataSource: (state, action: PayloadAction<object>): SettingsState => {
            return { ...state, hasFetched: true, dataSource: action.payload };
        }
    }
});

export const { loadedDataSource } = dataSource.actions;
export const appSettingsReducer = dataSource.reducer;

export default {
    settings: appSettingsReducer
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConfigurationState {
    runtime: object;
    hasFetched: boolean;
}

const initialState: ConfigurationState = {
    runtime: {},
    hasFetched: false
};

const configurationSlice = createSlice({
    name: "configuration",
    initialState: initialState,
    reducers: {
        runtimeLoaded: (state, action: PayloadAction<object>): ConfigurationState => {
            return { ...state, hasFetched: true, runtime: action.payload };
        }
    }
});

export const { runtimeLoaded } = configurationSlice.actions;
export const configurationReducer = configurationSlice.reducer;

export default {
    configuration: configurationReducer
};

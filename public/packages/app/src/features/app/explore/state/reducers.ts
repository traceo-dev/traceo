import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TraceoLog } from "../../../../types/logs";

export interface LogsState {
    logs: TraceoLog[];
    hasFetched: boolean;
}

const initialState: LogsState = {
    logs: [],
    hasFetched: false
};

const logsSlice = createSlice({
    name: "logs",
    initialState: initialState,
    reducers: {
        logsLoaded: (state, action: PayloadAction<TraceoLog[]>): LogsState => ({ ...state, hasFetched: true, logs: action.payload }),
        resetState: (state): LogsState => ({ ...state, hasFetched: false }),
    }
});

export const { logsLoaded, resetState } = logsSlice.actions;
export const logsReducer = logsSlice.reducer;

export default {
    logs: logsReducer
};

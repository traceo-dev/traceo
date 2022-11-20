import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TraceoLog } from "../../../../../types/logs";

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
        logsLoaded: (state, action: PayloadAction<TraceoLog[]>): LogsState => {
            return { ...state, hasFetched: true, logs: action.payload };
        },
        fetchedState: (state): LogsState => {
            return { ...state, hasFetched: false, logs: [] };
        },
    }
});

export const { logsLoaded, fetchedState } = logsSlice.actions;
export const logsReducer = logsSlice.reducer;

export default {
    logs: logsReducer
};

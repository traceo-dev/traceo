import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LogEventPayload } from "@traceo/types";

export interface LogsState {
  logs: LogEventPayload[];
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
    logsLoaded: (state, action: PayloadAction<LogEventPayload[]>): LogsState => ({
      ...state,
      hasFetched: true,
      logs: action.payload
    }),
    resetState: (state): LogsState => ({ ...state, hasFetched: false })
  }
});

export const { logsLoaded, resetState } = logsSlice.actions;
export const logsReducer = logsSlice.reducer;

export default {
  logs: logsReducer
};

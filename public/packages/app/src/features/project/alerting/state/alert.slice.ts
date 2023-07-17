import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAlert, IIncident } from "@traceo/types";

export interface State {
  alert: IAlert;
  isLoading: boolean;
}

const initialState: State = {
  alert: {} as IAlert,
  isLoading: false
};

const slice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    beginAlertFetch: (state): State => ({ ...state, isLoading: true }),
    endAlertFetch: (state): State => ({ ...state, isLoading: false }),
    setAlert: (state, action: PayloadAction<IAlert>): State => ({
      ...state,
      alert: action.payload
    }),
    resetAlertState: (): State => ({ ...initialState })
  }
});

export const { setAlert, resetAlertState, beginAlertFetch, endAlertFetch } = slice.actions;
export const reducer = slice.reducer;

export default {
  alert: reducer
};

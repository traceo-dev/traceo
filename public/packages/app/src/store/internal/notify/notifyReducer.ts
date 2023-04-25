import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";

export type NotifyType = "success" | "warning" | "error" | "info";
export type NotifyItem = {
  id?: string;
  title: string;
  description?: string;
  type: NotifyType;
};

export interface NotificationState {
  notifications: NotifyItem[];
}

const initialState = {
  notifications: [] as NotifyItem[]
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notify: (state, action: PayloadAction<NotifyItem>): NotificationState => {
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: v4(),
            ...action.payload
          }
        ]
      };
    },
    hideNotify: (state, { payload }: PayloadAction<NotifyItem>): NotificationState => {
      const notifications = state.notifications.filter(({ id }) => id !== payload.id);
      return { ...state, notifications };
    }
  }
});

export const { notify, hideNotify } = notificationSlice.actions;
export const notifyReducer = notificationSlice.reducer;

export default {
  notify: notifyReducer
};

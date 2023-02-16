import { notify as appNotify } from "../../store/internal/notify/notifyReducer";
import { store } from "../../store";

const success = (message: string, description?: string) => {
  store.dispatch(
    appNotify({
      title: message,
      description,
      type: "success"
    })
  );
};

const error = (message: string, description?: string) => {
  store.dispatch(
    appNotify({
      title: message,
      description,
      type: "error"
    })
  );
};

const warning = (message: string, description?: string) => {
  store.dispatch(
    appNotify({
      title: message,
      description,
      type: "warning"
    })
  );
};

const info = (message: string, description?: string) => {
  store.dispatch(
    appNotify({
      title: message,
      description,
      type: "info"
    })
  );
};

export const notify = {
  success,
  error,
  warning,
  info
};

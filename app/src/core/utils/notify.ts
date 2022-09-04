import { notification } from "antd";

const success = (message: string, description: string = "") => {
  notification.success({
    description,
    message,
    className: "bg-green-600",
    duration: 6,
    placement: "bottomRight"
  });
};

const error = (message: string | unknown, description: string = "") => {
  notification.error({
    description,
    message,
    className: "bg-red-600",
    duration: 6,
    placement: "bottomRight"
  });
};

const warning = (message: string, description: string = "") => {
  notification.info({
    description,
    message,
    className: "bg-blue-600",
    duration: 6,
    placement: "bottomRight"
  });
};

const info = (message: string, description: string = "") => {
  notification.info({
    description,
    message,
    className: "bg-orange-600",
    duration: 6,
    placement: "bottomRight"
  });
};

export const notify = {
  success,
  error,
  warning,
  info
};

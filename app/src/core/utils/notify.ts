import { notification } from "antd";

const success = (message: string, description = "") => {
  notification.success({
    description,
    message,
    className: "bg-green-600",
    duration: 6,
    placement: "topRight"
  });
};

const error = (message: string | unknown, description = "") => {
  notification.error({
    description,
    message,
    className: "bg-red-600",
    duration: 6,
    placement: "topRight"
  });
};

const warning = (message: string, description = "") => {
  notification.info({
    description,
    message,
    className: "bg-blue-600",
    duration: 6,
    placement: "topRight"
  });
};

const info = (message: string, description = "") => {
  notification.info({
    description,
    message,
    className: "bg-orange-600",
    duration: 6,
    placement: "topRight"
  });
};

export const notify = {
  success,
  error,
  warning,
  info
};
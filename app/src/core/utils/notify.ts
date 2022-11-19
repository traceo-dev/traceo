import { notification } from "antd";
import { ArgsProps } from "antd/lib/message";

type NotificationPlacement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

const commonOpts: Pick<ArgsProps, "className" | "duration"> = {
  className: "bg-green-600",
  duration: 6,
}

const success = (message: string, description = "") => {
  notification.success({
    message,
    description,
    placement: "topRight",
    ...commonOpts
  });
};

const error = (message: string | unknown, description = "") => {
  notification.success({
    message,
    description,
    placement: "topRight",
    ...commonOpts
  });
};

const warning = (message: string, description = "") => {
  notification.success({
    message,
    description,
    placement: "topRight",
    ...commonOpts
  });
};

const info = (message: string, description = "") => {
  notification.success({
    message,
    description,
    placement: "topRight",
    ...commonOpts
  });
};

export const notify = {
  success,
  error,
  warning,
  info
};

import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import { FC, useState } from "react";
import { joinClasses } from "../utils/classes";

type AlertType = "success" | "info" | "warning" | "error";

interface AlertProps {
  title?: string;
  type: AlertType;
  icon?: JSX.Element;
  message?: string | JSX.Element;
  className?: string;
  closeable?: boolean;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  showIcon?: boolean;
}

const mapAlertStyle: Record<AlertType, string> = {
  error: "bg-red-900 text-red-100",
  info: "bg-blue-900 text-blue-100",
  success: "bg-green-900 text-green-100",
  warning: "bg-orange-900 text-orange-100",
};

const mapAlertIcon: Record<AlertType, JSX.Element> = {
  error: <CloseCircleFilled />,
  info: <InfoCircleFilled />,
  success: <CheckCircleFilled />,
  warning: <ExclamationCircleFilled />,
};

export const Alert: FC<AlertProps> = (props: AlertProps) => {
  const [closed, setClosed] = useState<boolean>(false);
  const {
    title,
    type = "warning",
    icon,
    message,
    className,
    onClose,
    showIcon = true,
    closeable,
  } = props;

  if (closed) {
    return null;
  }

  const alertTypeStyle = mapAlertStyle[type];

  const handleClose = (e?: React.MouseEvent<HTMLButtonElement>) => {
    setClosed(true);
    onClose(e);
  };

  const alertIcon = !icon ? mapAlertIcon[type] : icon;

  const alertMessage =
    typeof message === "string" ? (
      <span className="text-xs">{message}</span>
    ) : (
      message
    );

  const alertTitle =
    typeof title === "string" ? (
      <span className="text-sm tracking-wide">{title}</span>
    ) : (
      title
    );

  return (
    <div
      className={joinClasses(
        "rounded w-full p-3 justify-between flex flex-row items-center",
        alertTypeStyle,
        className
      )}
    >
      <div className="flex flex-row items-center">
        {showIcon && <div className="pr-3">{alertIcon}</div>}
        <div className="flex flex-col">
          {title && alertTitle}
          {message && alertMessage}
        </div>
      </div>
      {closeable && (
        <span
          onClick={handleClose}
          className="items-center text-xs cursor-pointer"
        >
          <CloseOutlined />
        </span>
      )}
    </div>
  );
};

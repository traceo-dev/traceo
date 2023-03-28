import { useAppDispatch } from "../../../store";
import { hideNotify } from "../../../store/internal/notify/notifyReducer";
import { joinClasses } from "../../utils/classes";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled
} from "@ant-design/icons";
import { NotifyItem, NotifyType } from "@traceo/types";
import { FC, useEffect } from "react";

interface NotificationItemProps {
  notification: NotifyItem;
}

const mapNotifyIcon: Record<NotifyType, JSX.Element> = {
  error: <CloseCircleFilled />,
  info: <InfoCircleFilled />,
  success: <CheckCircleFilled />,
  warning: <ExclamationCircleFilled />
};

const mapNotifyStyle: Record<NotifyType, string> = {
  error: "bg-red-900",
  info: "bg-blue-900",
  success: "bg-green-900",
  warning: "bg-orange-900"
};

const durationMap: Record<NotifyType, number> = {
  error: 5000,
  warning: 5000,
  info: 3000,
  success: 3000
};

export const NotificationItem: FC<NotificationItemProps> = ({ notification }) => {
  const dispatch = useAppDispatch();

  const { title, type, description } = notification;

  useEffect(() => {
    setTimeout(() => {
      dispatch(hideNotify(notification));
    }, durationMap[type]);
  }, []);

  return (
    <div
      onClick={() => dispatch(hideNotify(notification))}
      className={joinClasses(
        "rounded-md py-3 px-5 flex flex-row items-center cursor-pointer w-64 z-50",
        "transition duration-300 ease-in-out transform",
        mapNotifyStyle[type]
      )}
    >
      <span className="pr-3">{mapNotifyIcon[type]}</span>
      <div className="flex flex-col text-xs gap-y-1">
        <span className="font-semibold">{title}</span>
        {description && <span className="font-normal">{description}</span>}
      </div>
    </div>
  );
};

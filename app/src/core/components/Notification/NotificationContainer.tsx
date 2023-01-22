import { useSelector } from "react-redux";
import { StoreState } from "types/store";
import { NotificationItem } from "./NotificationItem";

export const NotificationContainer = () => {
  const { notifications } = useSelector((state: StoreState) => state.notify);

  return (
    <div className="z-10 flex flex-col gap-y-5 h-full justify-end self-end p-5">
      {notifications.map((notification, index) => (
        <NotificationItem key={index} notification={notification} />
      ))}
    </div>
  );
};

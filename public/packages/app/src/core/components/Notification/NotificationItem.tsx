import { useAppDispatch } from "../../../store";
import { NotifyItem, NotifyType, hideNotify } from "../../../store/internal/notify/notifyReducer";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled
} from "@ant-design/icons";
import { FC, useEffect } from "react";
import styled from "styled-components";

interface NotificationItemProps {
  notification: NotifyItem;
}

const mapNotifyIcon: Record<NotifyType, JSX.Element> = {
  error: <CloseCircleFilled />,
  info: <InfoCircleFilled />,
  success: <CheckCircleFilled />,
  warning: <ExclamationCircleFilled />
};

const mapBgColor: Record<NotifyType, string> = {
  error: "#4F0A28",
  info: "#172554",
  success: "#022D25",
  warning: "#431D08"
};

const mapBorderColor: Record<NotifyType, string> = {
  error: "#981E54",
  info: "#2666EB",
  success: "#077A61",
  warning: "#9E630B"
};

const durationMap: Record<NotifyType, number> = {
  error: 5000,
  warning: 5000,
  info: 3000,
  success: 3000
};

const Notify = styled.div<{ type: NotifyType }>`
  border: 1px solid ${(p) => mapBorderColor[p.type]};
  background-color: ${(p) => mapBgColor[p.type]};
  border-radius: 4px;
  padding-inline: 9px;
  padding-block: 12px;
  cursor: pointer;
  width: 256px;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: row;
  items-align: center;
  z-index: 50;
`;

export const NotificationItem: FC<NotificationItemProps> = ({ notification }) => {
  const dispatch = useAppDispatch();

  const { title, type, description } = notification;

  useEffect(() => {
    setTimeout(() => {
      dispatch(hideNotify(notification));
    }, durationMap[type]);
  }, []);

  return (
    <Notify type={type} onClick={() => dispatch(hideNotify(notification))}>
      <span className="pr-3">{mapNotifyIcon[type]}</span>
      <div className="flex flex-col self-center text-xs">
        <span className="font-semibold">{title}</span>
        {description && <span className="pt-1 font-normal">{description}</span>}
      </div>
    </Notify>
  );
};

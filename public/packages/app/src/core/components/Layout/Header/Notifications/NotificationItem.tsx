import { Row } from "@traceo/ui";
import dateUtils from "../../../../../core/utils/date";
import styled from "styled-components";

const ItemWrapper = styled.div`
  padding: 12px;
  background-color: var(--color-bg-secondary);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background-color: var(--color-bg-light-secondary);
  }
`;

export const NotificationItem = ({ notification }) => {
  return (
    <ItemWrapper>
      <Row gap="x-3">
        <span className="text-xl">{notification.icon}</span>
        <div className="flex flex-col leading-5">
          <span className="font-semibold text-sm">{notification.title}</span>
          <span className="text-xs">{notification.description}</span>
        </div>
      </Row>
      <span className="text-xs">{dateUtils.fromNow(notification.createdAt)}</span>
    </ItemWrapper>
  );
};

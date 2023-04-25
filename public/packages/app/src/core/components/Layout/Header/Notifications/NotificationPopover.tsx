import { BellFilled, BellOutlined, LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { NotificationItem } from "./NotificationItem";
import { Popover, Typography } from "@traceo/ui";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { Notification } from "@traceo/types";
import styled from "styled-components";

const InnerContainer = styled.div`
  padding-top: 28px;
  padding-bottom: 28px;
  justify-content: center;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const NotificationPopover = () => {
  const { data: notifications, isLoading } = useReactQuery<Notification[]>({
    queryKey: ["notifications"],
    url: "/api/user/notifications"
  });

  return (
    <Popover
      showArrow={false}
      placement="bottom-start"
      overrideStyles={{ transitionDuration: 0, marginTop: "10px" }}
      content={
        <div className="w-full flex flex-col" style={{ minWidth: "350px" }}>
          <span className="font-semibold p-2">Notifications</span>
          <div
            className="w-full flex flex-col gap-y-2 overflow-y-scroll"
            style={{ maxHeight: "400px" }}
          >
            {isLoading && (
              <InnerContainer>
                <LoadingOutlined className="text-2xl" />
              </InnerContainer>
            )}
            {notifications?.length === 0 && (
              <InnerContainer>
                <SearchOutlined className="text-2xl" />
                <Typography className="font-semibold">Not found</Typography>
              </InnerContainer>
            )}

            {notifications?.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))}
          </div>
        </div>
      }
    >
      <BellOutlined className="icon-btn" />
      {/* <BellFilled className="icon-btn text-yellow-600" /> */}
    </Popover>
  );
};

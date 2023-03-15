import { useAppDispatch } from "../../../../../store";
import { StoreState } from "@store/types";
import { Popover, Avatar } from "@traceo/ui";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadApplications } from "../../../../../features/dashboard/state/actions";
import styled from "styled-components";
import { AppstoreOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const AppRow = styled.div`
  text-align: start;
  padding: 6px;
  padding-inline: 18px;
  margin-bottom: 5px;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: row;

  &:hover {
    background-color: var(--color-bg-secondary);
    color: #ffffff;
  }
`;

const options = [
  {
    label: "Applications",
    icon: <AppstoreOutlined />,
    href: "/dashboard/applications"
  },
  {
    label: "New app",
    icon: <PlusOutlined />,
    href: "/dashboard/new-app"
  }
];

export const ApplicationSwitchPopover = () => {
  const dispatch = useAppDispatch();
  const { application, hasFetched } = useSelector((state: StoreState) => state.application);

  useEffect(() => {
    dispatch(loadApplications());
  }, []);

  const content = (
    <div className="flex flex-col w-[230px]">
      <span className="text-start border-bottom p-3">
        <div className="flex flex-row items-center">
          <Avatar size="md" alt={application.name} src={application.gravatar} />
          <div className="flex flex-col text-start pl-2">
            <span className="font-semibold">{application.name}</span>
            <span className="text-xs">{application.sdk}</span>
          </div>
        </div>
      </span>
      <div className="py-3">
        {options?.map(({ label, href, icon }, index) => (
          <a href={href} key={index}>
            <AppRow>
              <div className="pr-2">{icon}</div>
              {label}
            </AppRow>
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottom-end"
      showArrow={false}
      overrideStyles={{
        marginTop: "15px",
        transitionDuration: 0
      }}
      content={content}
    >
      <div className="flex flex-row w-full justify-between items-center">
        {!hasFetched ? (
          <LoadingOutlined />
        ) : (
          <Avatar size="md" alt={application.name} src={application.gravatar} />
        )}
        <div className="flex flex-col text-start pl-3">
          <span className="font-semibold">{application.name}</span>
          <div className="flex flex-row gap-x-1 items-center">
            <img src={`/img/sdk/${application.sdk}.svg`} width="10" />
            <span className="text-2xs capitalize">{application.sdk}</span>
          </div>
        </div>
      </div>
    </Popover>
  );
};

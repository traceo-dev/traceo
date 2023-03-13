import { useAppDispatch } from "../../../../store";
import { StoreState } from "@store/types";
import { Popover, Avatar } from "@traceo/ui";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadApplications } from "src/features/dashboard/state/actions";
import styled from "styled-components";
import {
  AppstoreOutlined,
  ArrowDownOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import { logout } from "src/core/utils/logout";
import { NavbarItem } from "./NavBarItem";

const AppRow = styled.div`
  text-align: start;
  padding: 6px;
  padding-inline: 18px;
  margin-bottom: 5px;

  &:hover {
    background-color: var(--color-bg-secondary);
    color: #ffffff;
  }
`;

export const ApplicationSwitchPopover = () => {
  const dispatch = useAppDispatch();
  const { applications, hasFetched } = useSelector((state: StoreState) => state.applications);
  const { application, hasFetched: isAppFetched } = useSelector(
    (state: StoreState) => state.application
  );

  useEffect(() => {
    dispatch(loadApplications());
  }, []);

  const options = [
    {
      label: "Applications",
      href: "/"
    },
    {
      label: "Members",
      href: "/"
    },
    {
      label: "Settings",
      href: "/"
    }
  ];

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
        {options?.map(({ label }, index) => (
          <AppRow key={index}>
            <div className="flex flex-row gap-x-2 items-center">{label}</div>
          </AppRow>
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
        <Avatar size="md" alt={application.name} src={application.gravatar} />
        <div className="flex flex-col text-start pl-2">
          <span className="font-semibold">{application.name}</span>
          <span className="text-xs">{application.sdk}</span>
        </div>
      </div>
    </Popover>
  );
};

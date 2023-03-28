import {
  AppstoreOutlined,
  LoadingOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  SwapOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Popover } from "@traceo/ui";
import { useApplication } from "../../../../core/hooks/useApplication";
import { HeaderItem } from "./HeaderItem";
import { buildHeaderItems } from "./utils";
import styled from "styled-components";
import { useAppDispatch } from "../../../../store/index";
import { useEffect } from "react";
import { loadApplications } from "src/features/dashboard/state/actions";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../store/types";
import { logout } from "src/core/utils/logout";
import { TraceoLogo } from "../../Icons/TraceoLogo";
import { MenuRoute } from "src/core/types/navigation";
import ServerPermissions from "../../ServerPermissions";

const createNewOptions: MenuRoute[] = [
  {
    label: "Project",
    icon: <AppstoreOutlined />,
    href: "/dashboard/new-app"
  },
  {
    label: "User",
    icon: <UserOutlined />,
    href: "/dashboard/new-user"
  }
];
export const Header = () => {
  const { application } = useApplication();
  const { applications, hasFetched } = useSelector((state: StoreState) => state.applications);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadApplications());
  }, []);

  const isProjectDashboard = window.location.pathname.split("/").includes("project");

  const projectSwitcherContent = !hasFetched ? (
    <div className="min-w-[100px] min-h-[100px] text-center">
      <LoadingOutlined />
    </div>
  ) : (
    <div className="flex flex-col min-w-[230px] max-h-[200px]">
      <span className="text-sm p-2 border-bottom">Switch project</span>
      {applications?.map((app, key) => (
        <span
          onClick={() => (window.location.href = `/project/${app?.appId}/overview`)}
          className="text-sm p-2 hover:bg-secondary cursor-pointer flex flex-row items-center gap-x-3"
        >
          <Avatar size="sm" shape="square" alt={app?.name} src={app?.gravatar} />
          <span>{app?.name}</span>
        </span>
      ))}
    </div>
  );

  const createNewContent = (
    <div className="min-w-[180px] flex flex-col">
      <span className="text-sm p-2 border-bottom">Create new</span>
      {createNewOptions.map((route, key) => (
        <span
          key={key}
          onClick={() => (window.location.href = route.href)}
          className="text-primary text-sm p-2 hover:bg-secondary cursor-pointer flex flex-row items-center gap-x-3"
        >
          {route.icon}
          {route.label}
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full flex flex-col z-50 shadow-lg top-0 fixed">
      <header className="flex px-8 h-[40px] w-full bg-primary border-bottom justify-between items-center">
        <div className="flex flex-row items-center gap-x-5">
          <div className="flex flex-row items-center gap-x-2">
            {!isProjectDashboard ? (
              <>
                <TraceoLogo size="small" />
                <span className="text-sm font-semibold">Traceo</span>
              </>
            ) : (
              <>
                {!hasFetched ? (
                  <LoadingOutlined />
                ) : (
                  <>
                    <Avatar
                      shape="square"
                      size="sm"
                      alt={application?.name}
                      src={application?.gravatar}
                    />
                    <span className="text-xs font-semibold">{application?.name}</span>
                    <Popover
                      placement="bottom-end"
                      showArrow={false}
                      overrideStyles={{
                        marginTop: "15px",
                        transitionDuration: 0
                      }}
                      content={projectSwitcherContent}
                    >
                      <SwapOutlined className="text-xs cursor-pointer pl-5" />
                    </Popover>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-x-5 items-center">
          <ServerPermissions>
            <Popover
              placement="bottom-end"
              showArrow={false}
              overrideStyles={{
                marginTop: "15px",
                transitionDuration: 0
              }}
              content={createNewContent}
            >
              <HeaderButton>
                <span>New</span>
                <PlusOutlined />
              </HeaderButton>
            </Popover>

            {isProjectDashboard && (
              <SettingOutlined
                onClick={() => (window.location.href = `/dashboard/admin/users`)}
                className="icon-btn"
              />
            )}
          </ServerPermissions>

          {isProjectDashboard && (
            <UserOutlined
              onClick={() => (window.location.href = `/dashboard/profile/settings`)}
              className="icon-btn"
            />
          )}

          <LogoutOutlined onClick={() => logout()} className="icon-btn hover:text-red-600" />
        </div>
      </header>
      <SecondaryHeader>
        {buildHeaderItems(application).map((route, key) => (
          <HeaderItem key={key} route={route} />
        ))}
      </SecondaryHeader>
    </div>
  );
};

const SecondaryHeader = styled.nav`
  width: 100%;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-bg-light-secondary);
  position: relative;
  display: flex;
  align-items: center;
  padding-inline: 18px;
`;

const HeaderButton = styled.div`
  font-weight: 500;
  display: flex;
  flex-direction: row;
  font-size: 11px;
  align-items: center;
  border: 1px solid var(--color-traceo-primary);
  border-radius: 20px;
  cursor: pointer;
  padding-inline: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  gap: 8px;

  &:hover {
    background-color: var(--color-traceo-primary);
    color: var(--color-bg-primary);
  }
`;

export default Header;

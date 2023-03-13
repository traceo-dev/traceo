import { StoreState } from "@store/types";
import { useSelector } from "react-redux";
import {
  LoadingOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  LinkOutlined,
  AppstoreOutlined,
  DownOutlined
} from "@ant-design/icons";
import { Avatar, Divider, Popover } from "@traceo/ui";
import { useConfig } from "../../../../core/contexts/ConfigsContextProvider";
import { useApplication } from "../../../../core/hooks/useApplication";
import { logout } from "../../../utils/logout";
import { GH_REPO_LINK } from "../../../../core/utils/constants";
import { NavbarItem } from "./NavBarItem";
import styled from "styled-components";
import { DemoBanner } from "../../DemoBanner";
import { useUser } from "../../../../core/hooks/useUser";
import { buildAppNavbar } from "./utils";
import { ApplicationSwitchPopover } from "./ApplicationSwitchPopover";
import { UserProfilePopover } from "./UserProfilePopover";

export const NavBar = () => {
  const { hidden } = useSelector((state: StoreState) => state.navbar);
  const { application, hasFetched } = useApplication();
  const user = useUser();
  const configs = useConfig();

  const renderProfileIcon = () => {
    if (!user.isFetched) {
      return <LoadingOutlined />;
    }

    return (
      <div className="flex flex-row items-center">
        <Avatar size="md" alt={user.name} src={user.gravatar} />
        <div className="flex flex-col text-start pl-2">
          <span className="font-semibold">{user.name}</span>
          <span className="text-xs">{user.email}</span>
        </div>
      </div>
    );
  };

  const isDashboard = window.location.pathname.split("/").includes("dashboard");
  const isAppDashboard = window.location.pathname.split("/").includes("app");

  const navigateDocumentation = () => window.open(GH_REPO_LINK, "_blank");

  const dashboardOverview = (
    <NavbarItem
      route={{
        key: "overview",
        href: "/dashboard/overview",
        label: "Overview",
        icon: <HomeOutlined />
      }}
    />
  );

  const dashboardAdmin = (
    <NavbarItem
      route={{
        key: "admin",
        href: "/dashboard/admin/users",
        label: "Admin panel",
        icon: <SettingOutlined />
      }}
    />
  );

  const dashboardDocumentation = (
    <NavbarItem
      route={{
        label: "Documentation",
        icon: <LinkOutlined />,
        onClick: () => navigateDocumentation()
      }}
    />
  );

  // application items

  const appOverview = (
    <NavbarItem
      route={{
        key: "overview",
        href: "/app/:id/overview",
        label: "Overview",
        icon: <HomeOutlined />
      }}
    />
  );

  const appSettings = (
    <NavbarItem
      route={{
        key: "settings",
        href: "/app/:id/settings/details",
        label: "Settings",
        icon: <SettingOutlined />
      }}
    />
  );

  const profile = (
    <NavbarItem
      route={{
        // key: "profile",
        // href: "/dashboard/profile/settings",
        // label: "Profile",
        // icon: <UserOutlined />,
        // private: configs.demoMode
        icon: <UserProfilePopover />,
        badge: <SettingOutlined className="text-xs" />
      }}
    />
  );

  const logoutItem = (
    <NavbarItem
      route={{
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: () => logout()
      }}
    />
  );

  const appIcon = (
    <NavbarItem
      route={{
        icon: <ApplicationSwitchPopover />,
        badge: <DownOutlined className="text-xs" />
      }}
    />
  );

  const userIcon = (
    <NavbarItem
      route={{
        icon: renderProfileIcon()
      }}
    />
  );

  if (hidden) {
    return null;
  }

  const renderNavbarFeatures = () => {
    if (!hasFetched) {
      return <LoadingOutlined />;
    }

    return buildAppNavbar(application).map((e, index) => <NavbarItem key={index} route={e} />);
  };

  return (
    <NavbarWrapper>
      <Nav>
        <ul className="p-0 h-full">
          {isDashboard && (
            <NavbarSectionGroup>
              <NavbarSection>
                {userIcon}
                <Divider />
                {dashboardOverview}
                {profile}
                {user && user.isAdmin && dashboardAdmin}
              </NavbarSection>
              {configs.demoMode && <DemoBanner />}
              <NavbarSection>
                {dashboardDocumentation}
                {logoutItem}
              </NavbarSection>
            </NavbarSectionGroup>
          )}

          {isAppDashboard && (
            <NavbarSectionGroup>
              <NavbarSection>
                {appIcon}
                <Divider />
                {appOverview}
                <Divider />
                {renderNavbarFeatures()}
                <Divider />
                {appSettings}
              </NavbarSection>
              {configs.demoMode && <DemoBanner />}
              <NavbarSection>
                {dashboardDocumentation}
                {logoutItem}
                {profile}
              </NavbarSection>
            </NavbarSectionGroup>
          )}
        </ul>
      </Nav>
    </NavbarWrapper>
  );
};

const NavbarSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavbarSectionGroup = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const NavbarWrapper = styled.div`
  height: 100%;
  width: 265px;
  overflow: auto !important;
  background-color: var(--color-bg-canvas);
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid var(--color-bg-secondary);
  padding-bottom: 0.5rem !important;
  padding-top: 0.5rem !important;
`;

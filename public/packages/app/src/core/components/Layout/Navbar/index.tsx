import { StoreState } from "@store/types";
import { useSelector } from "react-redux";
import {
  LoadingOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { Avatar, Divider } from "@traceo/ui";
import { useConfig } from "../../../../core/contexts/ConfigsContextProvider";
import { useApplication } from "../../../../core/hooks/useApplication";
import { logout } from "../../../utils/logout";
import { GH_REPO_LINK } from "../../../../core/utils/constants";
import { NavbarItem } from "./NavbarItem";
import styled from "styled-components";
import { DemoBanner } from "../../DemoBanner";
import { useUser } from "../../../../core/hooks/useUser";
import { buildAppNavbar } from "./utils";

export const NavBar = () => {
  const { hidden } = useSelector((state: StoreState) => state.navbar);
  const { application, hasFetched } = useApplication();
  const { isAdmin } = useUser();
  const configs = useConfig();

  const renderAppIcon = () => {
    if (!hasFetched) {
      return <LoadingOutlined />;
    }

    return <Avatar size="sm" alt={application.name} src={application.gravatar} />;
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
        key: "profile",
        href: "/dashboard/profile/settings",
        label: "Profile",
        icon: <UserOutlined />,
        private: configs.demoMode
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
        label: application?.name,
        icon: renderAppIcon()
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
        <ul className="p-0 pt-5 h-full">
          {isDashboard && (
            <NavbarSectionGroup>
              <NavbarSection>
                {dashboardOverview}
                {profile}
                {isAdmin && dashboardAdmin}
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
                {appOverview}
                <Divider />
                {renderNavbarFeatures()}
                <Divider />
                {appSettings}
              </NavbarSection>
              {configs.demoMode && <DemoBanner />}
              <NavbarSection>
                {profile}
                {logoutItem}
                {appIcon}
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
  padding-top: 3rem;
  overflow: auto !important;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid var(--color-bg-secondary);
  padding-bottom: 0.5rem !important;
  padding-top: 0.5rem !important;
`;

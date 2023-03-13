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
import { Divider } from "@traceo/ui";
import { useConfig } from "../../../../core/contexts/ConfigsContextProvider";
import { useApplication } from "../../../../core/hooks/useApplication";
import { logout } from "../../../utils/logout";
import { GH_REPO_LINK } from "../../../../core/utils/constants";
import { NavbarItem } from "./NavBarItem";
import styled from "styled-components";
import { DemoBanner } from "../../DemoBanner";
import { useUser } from "../../../../core/hooks/useUser";
import { buildAppNavbar } from "./utils";
import { ApplicationSwitchPopover } from "./Items/ApplicationSwitchPopover";
import { UserProfilePopover } from "./Items/UserProfilePopover";
import { TraceoLogo } from "../../Icons/TraceoLogo";

export const NavBar = () => {
  const { hidden } = useSelector((state: StoreState) => state.navbar);
  const { application, hasFetched } = useApplication();
  const user = useUser();
  const configs = useConfig();

  const isDashboard = window.location.pathname.split("/").includes("dashboard");
  const isAppDashboard = window.location.pathname.split("/").includes("app");

  const navigateDocumentation = () => window.open(GH_REPO_LINK, "_blank");

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
                <div className="px-5">
                  <TraceoLogo size="small" name={true} />
                </div>
                <Divider />
                <NavbarItem
                  route={{
                    key: "overview",
                    href: "/dashboard/overview",
                    label: "Applications",
                    icon: <AppstoreOutlined />
                  }}
                />
                <NavbarItem
                  route={{
                    icon: <UserOutlined />,
                    label: "Profile",
                    href: "/dashboard/profile/settings",
                    key: "profile"
                  }}
                />
                {user && user.isAdmin && (
                  <NavbarItem
                    route={{
                      key: "admin",
                      href: "/dashboard/admin/users",
                      label: "Admin panel",
                      icon: <SettingOutlined />
                    }}
                  />
                )}
              </NavbarSection>
              {configs.demoMode && <DemoBanner />}
              <NavbarSection>
                <NavbarItem
                  route={{
                    label: "Documentation",
                    icon: <LinkOutlined />,
                    onClick: () => navigateDocumentation()
                  }}
                />
                <NavbarItem
                  route={{
                    label: "Logout",
                    icon: <LogoutOutlined />,
                    onClick: () => logout()
                  }}
                />
              </NavbarSection>
            </NavbarSectionGroup>
          )}

          {isAppDashboard && (
            <NavbarSectionGroup>
              <NavbarSection>
                <NavbarItem
                  route={{
                    icon: <ApplicationSwitchPopover />,
                    badge: <DownOutlined className="text-xs" />
                  }}
                />
                <Divider />
                <NavbarItem
                  route={{
                    key: "overview",
                    href: "/app/:id/overview",
                    label: "Overview",
                    icon: <HomeOutlined />
                  }}
                />
                <Divider />
                {renderNavbarFeatures()}
                <Divider />
                <NavbarItem
                  route={{
                    key: "settings",
                    href: "/app/:id/settings/details",
                    label: "Settings",
                    icon: <SettingOutlined />
                  }}
                />
              </NavbarSection>
              {configs.demoMode && <DemoBanner />}
              <NavbarSection>
                <NavbarItem
                  route={{
                    label: "Documentation",
                    icon: <LinkOutlined />,
                    onClick: () => navigateDocumentation()
                  }}
                />
                <NavbarItem
                  route={{
                    label: "Logout",
                    icon: <LogoutOutlined />,
                    onClick: () => logout()
                  }}
                />
                <NavbarItem
                  route={{
                    icon: <UserProfilePopover />,
                    badge: <SettingOutlined className="text-xs" />,
                    key: "profile",
                    href: "/dashboard/profile/settings"
                  }}
                />
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
  width: 315px;
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

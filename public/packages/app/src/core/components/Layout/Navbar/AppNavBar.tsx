import { useConfig } from "../../../../core/contexts/ConfigsContextProvider";
import { useApplication } from "../../../hooks/useApplication";
import { MenuRoute } from "../../../types/navigation";
import { logout } from "../../../utils/logout";
import { DemoBanner } from "../../DemoBanner";
import { NavBarItem } from "./NavBarItem";
import { NavbarWrapper } from "./NavbarWrapper";
import {
  HomeOutlined,
  BugOutlined,
  CompassOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { Avatar, Divider } from "@traceo/ui";

export const AppNavBar = () => {
  const { application, hasFetched } = useApplication();
  const configs = useConfig();

  const renderAppIcon = () => {
    if (!hasFetched) {
      return <LoadingOutlined />;
    }

    return <Avatar size="sm" alt={application.name} src={application.gravatar} />;
  };

  const topRoutes: MenuRoute[] = [
    {
      key: "overview",
      href: "/app/:id/overview",
      label: "Overview",
      icon: <HomeOutlined />
    }
  ];

  const mainRoutes: MenuRoute[] = [
    {
      key: "incidents",
      href: "/app/:id/incidents",
      label: "Incidents",
      icon: <BugOutlined />
    },
    {
      key: "explore",
      href: "/app/:id/explore/logs",
      label: "Explore",
      icon: <CompassOutlined />
    },
    {
      key: "metrics",
      href: "/app/:id/metrics",
      label: "Metrics",
      icon: <BarChartOutlined />
    }
  ];

  const settingsRoutes: MenuRoute[] = [
    {
      key: "settings",
      href: "/app/:id/settings/details",
      label: "Settings",
      icon: <SettingOutlined />
    }
  ];

  const userRoutes: MenuRoute[] = [
    {
      key: "user",
      href: "/dashboard/profile/settings",
      label: "Profile",
      icon: <UserOutlined />,
      private: configs.demoMode
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => logout()
    },
    {
      label: application?.name,
      icon: renderAppIcon()
    }
  ];

  const filterRoutes = (routes: MenuRoute[]) =>
    configs.demoMode ? routes.filter((r) => !r.private) : routes;

  return (
    <NavbarWrapper>
      <ul className="p-0 pt-5 h-full">
        {filterRoutes(topRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}

        <Divider className="my-5" />

        {filterRoutes(mainRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}

        <Divider className="my-5" />

        {filterRoutes(settingsRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
      </ul>

      {configs.demoMode && <DemoBanner />}

      <ul className="p-0 pt-5">
        {filterRoutes(userRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
      </ul>
    </NavbarWrapper>
  );
};

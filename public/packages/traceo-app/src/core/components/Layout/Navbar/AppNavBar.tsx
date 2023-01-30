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
import { logout } from "../.../../../../../core/utils/logout";
import { MenuRoute } from "../.../../../../../types/navigation";
import { NavBarItem } from "./NavBarItem";
import { NavbarWrapper } from "./NavbarWrapper";
import { Avatar, Divider } from "@traceo/ui";
import { useAccount } from "../../../../core/hooks/useAccount";
import { useApplication } from "../../../../core/hooks/useApplication";

export const AppNavBar = () => {
  const { application, hasFetched } = useApplication();
  const account = useAccount();

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
      key: "account",
      href: "/dashboard/account/settings",
      label: "Account",
      icon: <UserOutlined />
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
    !account.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

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

      <ul className="p-0 pt-5">
        {filterRoutes(userRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
      </ul>
    </NavbarWrapper>
  );
};

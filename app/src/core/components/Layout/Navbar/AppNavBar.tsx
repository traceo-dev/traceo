import {
  HomeOutlined,
  BugOutlined,
  CompassOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Divider } from "antd";
import { logout } from "../.../../../../../core/utils/logout";
import { useSelector } from "react-redux";
import { MenuRoute } from "../.../../../../../types/navigation";
import { StoreState } from "../.../../../../../types/store";
import { AppSwitcher } from "../Header/components/AppSwitcher";
import { NavBarItem } from "./NavBarItem";
import { NavbarWrapper } from "./NavbarWrapper";

export const AppNavBar = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const { account } = useSelector((state: StoreState) => state.account);

  const topRoutes: MenuRoute[] = [
    {
      key: "overview",
      href: "/app/:id/:slug/overview",
      label: "Overview",
      icon: <HomeOutlined />
    }
  ];

  const mainRoutes: MenuRoute[] = [
    {
      key: "incidents",
      href: "/app/:id/:slug/incidents",
      label: "Incidents",
      icon: <BugOutlined />
    },
    {
      key: "explore",
      href: "/app/:id/:slug/explore/logs",
      label: "Explore",
      icon: <CompassOutlined />
    },
    {
      key: "metrics",
      href: "/app/:id/:slug/metrics",
      label: "Metrics",
      icon: <BarChartOutlined />
    }
  ];

  const settingsRoutes: MenuRoute[] = [
    {
      key: "settings",
      href: "/app/:id/:slug/settings/details",
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
      label: application.name,
      // href: "/app/:id/:slug/overview",
      icon: <AppSwitcher />
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

        <Divider />

        {filterRoutes(mainRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}

        <Divider />

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

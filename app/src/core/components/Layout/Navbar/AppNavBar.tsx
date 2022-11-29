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
import { TraceoLogo } from "../.../../../../../core/components/Icons/TraceoLogo";
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
      key: "home",
      disabled: true,
      icon: <TraceoLogo size="small" />,
      label: "",
      href: "/dashboard/overview"
    },
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
      label: application.name,
      href: "/app/:id/:slug/overview",
      icon: <AppSwitcher />
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => logout()
    }
  ];

  const filterRoutes = (routes: MenuRoute[]) =>
    !account.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

  return (
    <NavbarWrapper>
      <ul className="list-none p-0 h-full self-center space-y-2 justify-between">
        {filterRoutes(topRoutes).map((route) => (
          <NavBarItem route={route} />
        ))}

        <Divider className="pb-2" />

        {filterRoutes(mainRoutes).map((route) => (
          <NavBarItem route={route} />
        ))}

        <Divider className="pb-2" />

        {filterRoutes(settingsRoutes).map((route) => (
          <NavBarItem route={route} />
        ))}
      </ul>

      <ul className="list-none p-0 self-center space-y-2 justify-between">
        {filterRoutes(userRoutes).map((route) => (
          <NavBarItem route={route} />
        ))}
      </ul>
    </NavbarWrapper>
  );
};

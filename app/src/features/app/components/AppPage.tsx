import { useEffect } from "react";
import { loadApplication } from "../state/actions";
import { useParams } from "react-router-dom";
import { dispatch } from "../../../store/store";
import { MenuRoute } from "../../../types/navigation";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { isEmptyObject } from "../../../core/utils/object";
import NotFound from "../../../core/components/Layout/Pages/404";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { isSlugCorrect } from "../../../core/utils/url";
import { Divider } from "antd";
import { MainViewWrapper } from "../../../core/components/Layout/MainViewWrapper";
import { NavBarItem } from "../../../core/components/Layout/Navbar/NavBarItem";
import { NavbarWrapper } from "../../../core/components/Layout/Navbar/NavbarWrapper";
import {
  BarChartOutlined,
  BugOutlined,
  CompassOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { TraceoLogo } from "../../../core/components/Icons/TraceoLogo";
import { logout } from "../../../core/utils/logout";
import { AppSwitcher } from "../../../core/components/Layout/Header/components/AppSwitcher";

export const AppPage = ({ children }) => {
  const { id } = useParams();

  const { application } = useSelector((state: StoreState) => state.application);
  const { account } = useSelector((state: StoreState) => state.account);

  useEffect(() => {
    dispatch(loadApplication(id));
  }, []);

  const hasMemberRole = application?.member?.role;
  const isCorrectClug = isSlugCorrect(application?.name);

  if (isEmptyObject(application)) {
    return <TraceoLoading />;
  }

  if (!hasMemberRole || !isCorrectClug) {
    return <NotFound />;
  }

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
      label: "Logout",
      href: "",
      icon: <LogoutOutlined />,
      onClick: () => logout()
    },
    {
      label: application.name,
      href: "",
      adminRoute: false,
      icon: <AppSwitcher />
    }
  ];

  const filterRoutes = (routes: MenuRoute[]) =>
    !account.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

  return (
    <div className="flex max-h-full">
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
      <MainViewWrapper>{children}</MainViewWrapper>
    </div>
  );
};

export default AppPage;

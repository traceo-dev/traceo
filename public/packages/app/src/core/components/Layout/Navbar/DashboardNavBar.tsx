import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { logout } from "../../../utils/logout";
import { NavBarItem } from "./NavBarItem";
import { NavbarWrapper } from "./NavbarWrapper";
import { GH_REPO_LINK } from "../../../utils/constants";
import { MenuRoute } from "../../../types/navigation";
import { useConfig } from "../../../../core/contexts/ConfigsContextProvider";
import { DemoBanner } from "../../DemoBanner";

export const DashboardNavBar = () => {
  const configs = useConfig();

  const filterRoutes = (routes: MenuRoute[]) => {
    let r = routes;

    if (configs.demoMode && !configs?.user?.isAdmin) {
      r = routes.filter((route) => !route.private);
    }

    return r;
  };

  const navigateDocumentation = () => window.open(GH_REPO_LINK, "_blank");

  const topRoutes: MenuRoute[] = filterRoutes([
    {
      key: "overview",
      href: "/dashboard/overview",
      label: "Overview",
      icon: <HomeOutlined />
    }
  ]);

  const adminRoutes: MenuRoute[] = [
    {
      key: "admin",
      href: "/dashboard/admin/users",
      label: "Admin panel",
      adminRoute: true,
      icon: <SettingOutlined />
    }
  ];

  const userRoutes: MenuRoute[] = filterRoutes([
    {
      key: "profile",
      href: "/dashboard/profile/settings",
      label: "Profile",
      icon: <UserOutlined />,
      private: configs.demoMode
    }
  ]);

  const bottomRoutes: MenuRoute[] = filterRoutes([
    {
      label: "Documentation",
      href: "",
      icon: <LinkOutlined />,
      onClick: () => navigateDocumentation()
    },
    {
      label: "Logout",
      href: "",
      icon: <LogoutOutlined />,
      onClick: () => logout()
    }
  ]);

  return (
    <NavbarWrapper>
      <ul className="p-0 h-full pt-5">
        {topRoutes.map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
        {userRoutes.map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
        {configs?.user?.isAdmin &&
          adminRoutes.map((route, index) => <NavBarItem key={index} route={route} />)}
      </ul>

      {configs.demoMode && <DemoBanner />}

      <ul className="p-0">
        {bottomRoutes.map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
      </ul>
    </NavbarWrapper>
  );
};

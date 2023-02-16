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
import { useUser } from "../../../hooks/useUser";
import { MenuRoute } from "../../../types/navigation";

export const DashboardNavBar = () => {
  const user = useUser();

  const filterRoutes = (routes: MenuRoute[]) =>
    !user.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

  const navigateDocumentation = () => window.open(GH_REPO_LINK, "_blank");

  const topRoutes: MenuRoute[] = filterRoutes([
    {
      key: "overview",
      href: "/dashboard/overview",
      label: "Overview",
      icon: <HomeOutlined />
    }
  ]);

  const adminRoutes: MenuRoute[] = filterRoutes([
    {
      key: "admin",
      href: "/dashboard/admin/users",
      label: "Admin panel",
      adminRoute: true,
      icon: <SettingOutlined />
    }
  ]);

  const userRoutes: MenuRoute[] = filterRoutes([
    {
      key: "profile",
      href: "/dashboard/profile/settings",
      label: "Profile",
      icon: <UserOutlined />
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
        {adminRoutes.map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
      </ul>

      <ul className="p-0">
        {bottomRoutes.map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
      </ul>
    </NavbarWrapper>
  );
};

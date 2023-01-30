import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { logout } from "../.../../../../../core/utils/logout";
import { MenuRoute } from "../.../../../../../types/navigation";
import { NavBarItem } from "./NavBarItem";
import { NavbarWrapper } from "./NavbarWrapper";
import { GH_REPO_LINK } from "../.../../../../../core/utils/constants";
import { useAccount } from "../../../../core/hooks/useAccount";

export const DashboardNavBar = () => {
  const account = useAccount();

  const filterRoutes = (routes: MenuRoute[]) =>
    !account.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

  const navigateDocumentation = () => window.open(GH_REPO_LINK, "_blank");

  const topRoutes: MenuRoute[] = filterRoutes([
    {
      key: "overview",
      href: "/dashboard/overview",
      label: "Overview",
      icon: <HomeOutlined />
    }
  ]);

  const manageRoutes: MenuRoute[] = filterRoutes([
    {
      key: "management",
      href: "/dashboard/management/accounts",
      label: "Management",
      adminRoute: true,
      icon: <SettingOutlined />
    }
  ]);

  const userRoutes: MenuRoute[] = filterRoutes([
    {
      key: "account",
      href: "/dashboard/account/settings",
      label: "Account",
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

        {manageRoutes.map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}

        {userRoutes.map((route, index) => (
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

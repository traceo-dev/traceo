import { useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { loadAccount } from "../../auth/state/actions";
import { dispatch } from "../../../store/store";
import { MenuRoute } from "../../../types/navigation";
import { useDemo } from "../../../core/hooks/useDemo";
import {
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { TraceoLogo } from "core/components/Icons/TraceoLogo";
import { Divider } from "antd";
import { logout } from "core/utils/logout";

import { MainViewWrapper } from "core/components/Layout/MainViewWrapper";
import { NavBarItem } from "core/components/Layout/Navbar/NavBarItem";
import { NavbarWrapper } from "core/components/Layout/Navbar/NavbarWrapper";

export const DashboardPage = ({ children }) => {
  const { account } = useSelector((state: StoreState) => state.account);
  const { isDemo } = useDemo();

  useEffect(() => {
    dispatch(loadAccount());
  }, []);

  const topRoutes: MenuRoute[] = [
    {
      key: "home",
      disabled: true,
      icon: <TraceoLogo size="small" withName={false} />,
      label: "",
      href: ""
    },
    {
      key: "overview",
      href: "/dashboard/overview",
      label: "Overview",
      adminRoute: false,
      icon: <HomeOutlined />
    }
  ];

  const manageRoutes: MenuRoute[] = [
    {
      key: "management",
      href: "/dashboard/management/accounts",
      label: "Management",
      adminRoute: true,
      private: isDemo,
      icon: <SettingOutlined />
    }
  ];

  const userRoutes: MenuRoute[] = [
    {
      key: "account",
      href: "/dashboard/account/settings",
      label: "Account",
      adminRoute: false,
      private: isDemo,
      icon: <UserOutlined />
    }
  ];

  const bottomRoutes: MenuRoute[] = [
    {
      label: "Logout",
      href: "",
      adminRoute: false,
      icon: <LogoutOutlined />,
      onClick: () => logout()
    }
  ];

  const filterRoutes = (routes: MenuRoute[]) =>
    !account.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

  return (
    <>
      <div className="flex max-h-full">
        <NavbarWrapper>
          <ul className="list-none p-0 h-full self-center space-y-2 justify-between">
            {filterRoutes(topRoutes).map((route) => (
              <NavBarItem route={route} />
            ))}

            <Divider className="pb-2" />

            {filterRoutes(manageRoutes).map((route) => (
              <NavBarItem route={route} />
            ))}

            <Divider className="pb-2" />

            {filterRoutes(userRoutes).map((route) => (
              <NavBarItem route={route} />
            ))}
          </ul>

          <ul className="list-none p-0 self-center space-y-2 justify-between">
            {bottomRoutes.map((route) => (
              <NavBarItem route={route} />
            ))}
          </ul>
        </NavbarWrapper>
        <MainViewWrapper>{children}</MainViewWrapper>
      </div>
    </>
  );
};

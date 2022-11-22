import { useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { loadAccount } from "../../auth/state/actions";
import { dispatch } from "../../../store/store";
import { MenuRoute } from "../../../types/navigation";
import {
  HomeOutlined,
  LoadingOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { TraceoLogo } from "../../../core/components/Icons/TraceoLogo";
import { Divider } from "antd";
import { logout } from "../../../core/utils/logout";

import { MainViewWrapper } from "../../../core/components/Layout/MainViewWrapper";
import { NavBarItem } from "../../../core/components/Layout/Navbar/NavBarItem";
import { NavbarWrapper } from "../../../core/components/Layout/Navbar/NavbarWrapper";
import { isEmptyObject } from "../../../core/utils/object";
import { PageCenter } from "../../../core/components/PageCenter";
import { useCleanup } from "../../../core/hooks/useCleanup";

export const DashboardPage = ({ children }) => {
  useCleanup((state: StoreState) => state.application);

  const { account } = useSelector((state: StoreState) => state.account);

  useEffect(() => {
    dispatch(loadAccount());
  }, []);

  if (!account || isEmptyObject(account)) {
    return (
      <PageCenter>
        <LoadingOutlined />
      </PageCenter>
    );
  }

  const filterRoutes = (routes: MenuRoute[]) =>
    !account.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

  const topRoutes: MenuRoute[] = filterRoutes([
    {
      key: "home",
      disabled: true,
      icon: <TraceoLogo size="small" withName={false} />,
      label: "",
      href: "/dashboard/overview"
    },
    {
      key: "overview",
      href: "/dashboard/overview",
      label: "Overview",
      adminRoute: false,
      icon: <HomeOutlined />
    }
  ]);

  const manageRoutes: MenuRoute[] = filterRoutes([
    {
      key: "management",
      href: "/dashboard/management/accounts",
      label: "Management",
      adminRoute: true,
      private: !!account.isAdmin,
      icon: <SettingOutlined />
    }
  ]);

  const userRoutes: MenuRoute[] = filterRoutes([
    {
      key: "account",
      href: "/dashboard/account/settings",
      label: "Account",
      adminRoute: false,
      icon: <UserOutlined />
    }
  ]);

  const bottomRoutes: MenuRoute[] = filterRoutes([
    {
      label: "Logout",
      href: "",
      adminRoute: false,
      icon: <LogoutOutlined />,
      onClick: () => logout()
    }
  ]);

  return (
    <div className="flex max-h-full">
      <NavbarWrapper>
        <ul className="list-none p-0 h-full self-center space-y-2 justify-between">
          {topRoutes.map((route) => (
            <NavBarItem route={route} />
          ))}

          <Divider className="pb-2" />

          {manageRoutes.map((route) => (
            <NavBarItem route={route} />
          ))}

          {manageRoutes.length > 0 && <Divider className="pb-2" />}

          {userRoutes.map((route) => (
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
  );
};

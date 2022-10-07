import { AppstoreFilled, SettingOutlined, TeamOutlined } from "@ant-design/icons";
import PageHeader from "../../../core/components/PageHeader";
import { PagePanel } from "../../../core/components/PagePanel";
import { MenuRoute } from "../../../types/navigation";
import { Menu } from "../../../core/components/Layout/Menu";
import { DashboardPage } from "../../dashboard/components/DashboardPage";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { useEffect } from "react";
import { dispatch } from "../../../store/store";
import { loadAccount } from "../../../features/auth/state/actions";
import { isEmptyObject } from "../../../core/utils/object";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { PageCenter } from "core/components/PageCenter";
import NotFound from "core/components/Layout/Pages/404";

export const ManagementNavigation = ({ children }) => {
  const { account } = useSelector((state: StoreState) => state.account);

  useEffect(() => {
    dispatch(loadAccount());
  }, []);

  if (isEmptyObject(account)) {
    return <TraceoLoading />;
  } else if (!account.isAdmin) {
    return (
      <PageCenter>
        <NotFound />
      </PageCenter>
    );
  }

  const menu: MenuRoute[] = [
    {
      href: "/dashboard/management/accounts",
      label: "Accounts",
      key: "accounts",
      icon: <TeamOutlined />
    },
    {
      href: "/dashboard/management/apps",
      label: "Applications",
      key: "apps",
      icon: <AppstoreFilled />
    }
  ];

  return (
    <DashboardPage>
      <PageHeader
        icon={<SettingOutlined />}
        title={"Management"}
        subTitle={"Manage your server resources"}
      />
      <Menu className="mt-5" routes={menu} />
      <PagePanel className="mt-0 rounded-none rounded-b-md">{children}</PagePanel>
    </DashboardPage>
  );
};

import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import PageHeader from "../../../core/components/PageHeader";
import { PagePanel } from "../../../core/components/PagePanel";
import { MenuRoute } from "../../../types/navigation";
import { Menu } from "../../../core/components/Layout/Menu";
import { DashboardPage } from "../../../core/components/Layout/Pages/DashboardPage";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { useEffect } from "react";
import { dispatch } from "../../../store/store";
import { loadAccount } from "../../../features/auth/state/actions";
import { isEmptyObject } from "../../../core/utils/object";
import { TraceoLoading } from "../../../core/components/TraceoLoading";

export const DashboardSettingsNavigation = ({ children }) => {
  const { account } = useSelector((state: StoreState) => state.account);

  useEffect(() => {
    dispatch(loadAccount());
  }, []);

  if (isEmptyObject(account)) {
    return <TraceoLoading />;
  }

  const menu: MenuRoute[] = [
    {
      href: "/dashboard/account/settings",
      label: "Settings",
      key: "settings",
      icon: <SettingOutlined />
    }
  ];

  return (
    <DashboardPage>
      <PageHeader
        icon={<UserOutlined />}
        title={"Account"}
        subTitle={"Your account settings"}
      />
      <Menu className="mt-5" routes={menu} />
      <PagePanel className="mt-0 rounded-none rounded-b-md">{children}</PagePanel>
    </DashboardPage>
  );
};

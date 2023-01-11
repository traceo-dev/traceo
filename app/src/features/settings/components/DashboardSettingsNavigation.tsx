import { SettingOutlined } from "@ant-design/icons";
import PageHeader from "../../../core/components/PageHeader";
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
import { Avatar } from "core/ui-components/Avatar/Avatar";

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
        icon={<Avatar size="lg" src={account?.gravatar} alt={account.username} />}
        title="Account"
        subTitle="Your account settings"
      />
      <Menu className="mt-5" routes={menu} />
      {children}
    </DashboardPage>
  );
};

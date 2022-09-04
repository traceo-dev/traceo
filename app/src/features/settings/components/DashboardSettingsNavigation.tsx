import {
  ApiOutlined,
  LoadingOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import PageHeader from "../../../core/components/PageHeader";
import { PagePanel } from "../../../core/components/PagePanel";
import { MenuRoute } from "src/types/navigation";
import { Menu } from "src/core/components/Layout/Menu";
import { DashboardPage } from "src/core/components/Layout/Pages/DashboardPage";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";
import { useEffect } from "react";
import { dispatch } from "src/store/store";
import { loadAccount } from "src/features/auth/state/actions";
import { useNavigate } from "react-router-dom";
import { isEmptyObject } from "src/core/utils/object";
import { TraceoLoading } from "src/core/components/TraceoLoading";

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
      label: "Account",
      key: "settings",
      icon: <UserOutlined />
    }
  ];

  return (
    <DashboardPage>
      <PageHeader
        icon={<SettingOutlined />}
        title={"Settings"}
        subTitle={"Your account settings"}
      />
      <Menu className="mt-5" routes={menu} />
      <PagePanel className="mt-0 rounded-none rounded-b-md">{children}</PagePanel>
    </DashboardPage>
  );
};

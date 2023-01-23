import {
  AppstoreFilled,
  InfoCircleOutlined,
  SettingOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { PageHeader } from "core/ui-components/PageHeader";
import { MenuRoute } from "../../../types/navigation";
import { Menu } from "../../../core/components/Layout/Menu";
import { DashboardWrapper } from "../../dashboard/components/DashboardPage";
import { PageCenter } from "../../../core/components/PageCenter";
import NotFound from "../../../core/components/Layout/Pages/NotFound";
import { useAccount } from "core/hooks/useAccount";

export const ManagementNavigation = ({ children }) => {
  const account = useAccount();

  if (!account.isAdmin) {
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
    },
    {
      href: "/dashboard/management/instance",
      label: "Instance Info",
      key: "instance",
      icon: <InfoCircleOutlined />
    }
  ];

  return (
    <DashboardWrapper>
      <PageHeader
        icon={<SettingOutlined />}
        title={"Management"}
        description={"Manage your server resources"}
      />
      <Menu className="mt-5" routes={menu} />
      {children}
    </DashboardWrapper>
  );
};

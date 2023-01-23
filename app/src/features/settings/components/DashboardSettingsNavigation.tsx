import { SettingOutlined } from "@ant-design/icons";
import { PageHeader } from "core/ui-components/PageHeader";
import { MenuRoute } from "../../../types/navigation";
import { Menu } from "../../../core/components/Layout/Menu";
import { DashboardWrapper } from "../../dashboard/components/DashboardPage";
import { Avatar } from "core/ui-components/Avatar";
import { useAccount } from "core/hooks/useAccount";

export const DashboardSettingsNavigation = ({ children }) => {
  const account = useAccount();

  const menu: MenuRoute[] = [
    {
      href: "/dashboard/account/settings",
      label: "Settings",
      key: "settings",
      icon: <SettingOutlined />
    }
  ];

  return (
    <DashboardWrapper>
      <PageHeader
        icon={<Avatar size="lg" src={account?.gravatar} alt={account.username} />}
        title="Account"
        description="Your account settings"
      />
      <Menu className="mt-5" routes={menu} />
      {children}
    </DashboardWrapper>
  );
};

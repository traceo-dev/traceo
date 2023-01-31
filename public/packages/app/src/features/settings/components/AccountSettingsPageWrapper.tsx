import { SettingOutlined } from "@ant-design/icons";
import { MenuRoute } from "@traceo/types";
import { Avatar } from "@traceo/ui";
import { useAccount } from "../../../core/hooks/useAccount";
import { Page } from "../../../core/components/Page";

export const AccountSettingsPageWrapper = ({ children }) => {
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
    <Page
      menuRoutes={menu}
      header={{
        icon: <Avatar size="lg" src={account?.gravatar} alt={account.username} />,
        title: "Account",
        description: "Your account settings"
      }}
    >
      <Page.Content>{children}</Page.Content>
    </Page>
  );
};

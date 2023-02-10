import { SettingOutlined } from "@ant-design/icons";
import { MenuRoute } from "@traceo/types";
import { Avatar } from "@traceo/ui";
import { userUser } from "../../../core/hooks/useUser";
import { Page } from "../../../core/components/Page";

export const UserSettingsPageWrapper = ({ children }) => {
  const user = userUser();

  const menu: MenuRoute[] = [
    {
      href: "/dashboard/user/settings",
      label: "Settings",
      key: "settings",
      icon: <SettingOutlined />
    }
  ];

  return (
    <Page
      menuRoutes={menu}
      header={{
        icon: <Avatar size="lg" src={user?.gravatar} alt={user.username} />,
        title: "Profile",
        description: "Your account settings"
      }}
    >
      <Page.Content>{children}</Page.Content>
    </Page>
  );
};

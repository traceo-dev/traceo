import { Page } from "../../../../core/components/Page";
import { MenuRoute } from "../../../../core/types/navigation";
import { InfoCircleOutlined, SettingOutlined, TeamOutlined } from "@ant-design/icons";
import { FC } from "react";

export const SettingsPageWrapper: FC = ({ children }) => {
  const menu: MenuRoute[] = [
    {
      href: "/project/:id/settings/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    {
      href: "/project/:id/settings/access",
      label: "Access",
      key: "access",
      icon: <TeamOutlined />
    }
  ];

  return (
    <Page
      header={{
        icon: <SettingOutlined />,
        title: "Settings",
        description: "Manage project settings for your team."
      }}
      menuRoutes={menu}
    >
      <Page.Content className="pt-0">{children}</Page.Content>
    </Page>
  );
};

export default SettingsPageWrapper;

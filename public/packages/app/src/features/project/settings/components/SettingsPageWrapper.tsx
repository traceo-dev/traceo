import { Page } from "../../../../core/components/Page";
import { MenuRoute } from "../../../../core/types/navigation";
import { DatabaseOutlined, InfoCircleOutlined, SettingOutlined, TeamOutlined } from "@ant-design/icons";
import { FC } from "react";

const routes: MenuRoute[] = [
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
  },
  {
    href: "/project/:id/settings/datasources",
    label: "Datasources",
    key: "datasources",
    icon: <DatabaseOutlined />
  }
];

export const SettingsPageWrapper: FC = ({ children }) => {
  return (
    <Page
      title="Settings"
      header={{
        icon: <SettingOutlined />,
        title: "Settings",
        description: "Manage project settings for your team."
      }}
      menuRoutes={routes}
    >
      <Page.Content className="pt-0">{children}</Page.Content>
    </Page>
  );
};

export default SettingsPageWrapper;

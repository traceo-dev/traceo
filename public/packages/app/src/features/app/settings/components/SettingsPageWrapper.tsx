import { Page } from "../../../../core/components/Page";
import { MenuRoute } from "../../../../core/types/navigation";
import {
  DatabaseOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { FC } from "react";
import { SDK } from "@traceo/types";
import { useApplication } from "../../../../core/hooks/useApplication";

export const SettingsPageWrapper: FC = ({ children }) => {
  const { application } = useApplication();

  const menu: MenuRoute[] = [
    {
      href: "/app/:id/settings/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    {
      href: "/app/:id/settings/access",
      label: "Access",
      key: "access",
      icon: <TeamOutlined />
    },
    {
      href: "/app/:id/settings/datasource",
      label: "Data source",
      key: "datasource",
      icon: <DatabaseOutlined />,
      hidden: [SDK.REACT].includes(application.sdk)
    }
  ];

  return (
    <Page
      header={{
        icon: <SettingOutlined />,
        title: "Settings",
        description: "Management of this app"
      }}
      menuRoutes={menu}
    >
      <Page.Content>{children}</Page.Content>
    </Page>
  );
};

export default SettingsPageWrapper;

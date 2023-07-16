import { useProject } from "src/core/hooks/useProject";
import { Page } from "../../../../core/components/Page";
import { MenuRoute } from "../../../../core/types/navigation";
import { InfoCircleOutlined, SettingOutlined, TeamOutlined } from "@ant-design/icons";
import { FC, useMemo } from "react";
import { MemberRole } from "@traceo/types";

export const SettingsPageWrapper: FC = ({ children }) => {
  const { permission } = useProject();

  const menu = useMemo(() => {
    const routes: MenuRoute[] = [
      {
        href: "/project/:id/settings/details",
        label: "Details",
        key: "details",
        icon: <InfoCircleOutlined />
      }
    ];

    if ([MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER].includes(permission)) {
      routes.push({
        href: "/project/:id/settings/access",
        label: "Access",
        key: "access",
        icon: <TeamOutlined />
      });
    }

    return routes;
  }, [permission]);

  return (
    <Page
      title="Settings"
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

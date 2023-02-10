import {
  AppstoreFilled,
  InfoCircleOutlined,
  SettingOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { MenuRoute } from "@traceo/types";
import { PageCenter } from "../../../core/components/PageCenter";
import NotFound from "../../../core/components/Layout/Pages/NotFound";
import { useUser } from "../../../core/hooks/useUser";
import { Page } from "../../../core/components/Page";
import { FC } from "react";

interface Props {
  isLoading?: boolean;
}
export const DashboardPageWrapper: FC<Props> = ({ children, isLoading }) => {
  const user = useUser();

  if (!user.isAdmin) {
    return (
      <PageCenter>
        <NotFound />
      </PageCenter>
    );
  }

  const menu: MenuRoute[] = [
    {
      href: "/dashboard/admin/users",
      label: "Users",
      key: "users",
      icon: <TeamOutlined />
    },
    {
      href: "/dashboard/admin/apps",
      label: "Applications",
      key: "apps",
      icon: <AppstoreFilled />
    },
    {
      href: "/dashboard/admin/instance",
      label: "Instance Info",
      key: "instance",
      icon: <InfoCircleOutlined />
    }
  ];

  return (
    <Page
      header={{
        icon: <SettingOutlined />,
        title: "Admin panel",
        description: "Manage your server resources"
      }}
      isLoading={isLoading}
      menuRoutes={menu}
    >
      <Page.Content>{children}</Page.Content>
    </Page>
  );
};

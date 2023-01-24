import {
  AppstoreFilled,
  InfoCircleOutlined,
  SettingOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { MenuRoute } from "../../../types/navigation";
import { PageCenter } from "../../../core/components/PageCenter";
import NotFound from "../../../core/components/Layout/Pages/NotFound";
import { useAccount } from "core/hooks/useAccount";
import { Page } from "core/components/Page";
import { FC } from "react";

interface Props {
  isLoading?: boolean;
}
export const DashboardPageWrapper: FC<Props> = ({ children, isLoading }) => {
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
    <Page
      header={{
        icon: <SettingOutlined />,
        title: "Management",
        description: "Manage your server resources"
      }}
      isLoading={isLoading}
      menuRoutes={menu}
    >
      <Page.Content>{children}</Page.Content>
    </Page>
  );
};

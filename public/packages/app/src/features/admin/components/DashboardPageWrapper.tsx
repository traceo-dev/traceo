import NotFound from "../../../core/components/Layout/Pages/NotFound";
import { Page } from "../../../core/components/Page";
import { useUser } from "../../../core/hooks/useUser";
import { MenuRoute } from "../../../core/types/navigation";
import {
  AppstoreFilled,
  InfoCircleOutlined,
  SettingOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { FC, useEffect } from "react";
import { useAppDispatch } from "src/store";
import { resetProjectState } from "src/features/project/state/project/reducers";

const menu: MenuRoute[] = [
  {
    href: "/dashboard/admin/users",
    label: "Users",
    key: "users",
    icon: <TeamOutlined />
  },
  {
    href: "/dashboard/admin/apps",
    label: "Projects",
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

interface Props {
  isLoading?: boolean;
}
export const DashboardPageWrapper: FC<Props> = ({ children, isLoading }) => {
  const user = useUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetProjectState());
  }, []);

  if (!user.isAdmin) {
    return <NotFound />;
  }

  return (
    <Page
      title="Admin panel"
      header={{
        icon: <SettingOutlined />,
        title: "Admin panel",
        description: "Manage your instance resources"
      }}
      isLoading={isLoading}
      menuRoutes={menu}
    >
      <Page.Content className="pt-0">{children}</Page.Content>
    </Page>
  );
};

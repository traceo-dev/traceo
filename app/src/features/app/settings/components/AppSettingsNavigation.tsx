import AppPage from "../../components/AppPage";
import PageHeader from "../../../../core/components/PageHeader";
import {
  DatabaseOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { MenuRoute } from "../../../../types/navigation";
import { Menu } from "../../../../core/components/Layout/Menu";
import { FC } from "react";
import { useDemo } from "../../../../core/hooks/useDemo";

interface Props {
  children: any;
}
export const AppSettingsNavigationPage: FC<Props> = ({ children }) => {
  const { isDemo } = useDemo();

  const menu: MenuRoute[] = [
    {
      href: "/app/:id/:slug/settings/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    {
      href: "/app/:id/:slug/settings/access",
      label: "Access",
      key: "access",
      icon: <TeamOutlined />
    },
    {
      href: "/app/:id/:slug/settings/datasource",
      label: "Data source",
      key: "datasource",
      icon: <DatabaseOutlined />,
      private: isDemo
    }
  ];

  return (
    <>
      <AppPage>
        <PageHeader
          icon={<SettingOutlined />}
          title="Settings"
          subTitle="Management of this application"
        />
        <Menu className=" mt-5" routes={menu} />
        {children}
      </AppPage>
    </>
  );
};

export default AppSettingsNavigationPage;

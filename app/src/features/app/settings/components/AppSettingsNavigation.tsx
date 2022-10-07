import AppPage from "../../components/AppPage";
import PageHeader from "../../../../core/components/PageHeader";
import { DatabaseOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { PagePanel } from "../../../../core/components/PagePanel";
import { MenuRoute } from "../../../../types/navigation";
import { Menu } from "../../../../core/components/Layout/Menu";
import { FC } from "react";

interface Props {
  isPanel?: boolean;
  children: any;
}
export const AppSettingsNavigationPage: FC<Props> = ({ isPanel = true, children }) => {
  const menu: MenuRoute[] = [
    {
      href: "/app/:id/:slug/settings/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    {
      href: "/app/:id/:slug/settings/datasource",
      label: "Data source",
      key: "datasource",
      icon: <DatabaseOutlined />
    }
  ];

  return (
    <>
      <AppPage>
        <PageHeader
          icon={<SettingOutlined />}
          title={"Settings"}
          subTitle={"Management of the current application"}
        />
        <Menu className=" mt-5" routes={menu} />
        {isPanel ? (
          <PagePanel className="mt-0 rounded-none rounded-b-md">{children}</PagePanel>
        ) : (
          children
        )}
      </AppPage>
    </>
  );
};

export default AppSettingsNavigationPage;

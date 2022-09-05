import AppPage from "../../../../core/components/Layout/Pages/AppPage";
import PageHeader from "../../../../core/components/PageHeader";
import {
  ApiOutlined,
  InfoCircleOutlined,
  LockOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { PagePanel } from "../../../../core/components/PagePanel";
import { MenuRoute } from "src/types/navigation";
import { Menu } from "src/core/components/Layout/Menu";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";

export const AppSettingsNavigationPage = ({ children }) => {
  const menu: MenuRoute[] = [
    {
      href: "/app/:id/:slug/settings/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    // {
    //   href: "/app/:id/:slug/settings/credentials",
    //   label: "Credentials",
    //   key: "credentials",
    //   icon: <LockOutlined />
    // }
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
        <PagePanel className="mt-0 rounded-none rounded-b-md">{children}</PagePanel>
      </AppPage>
    </>
  );
};

export default AppSettingsNavigationPage;

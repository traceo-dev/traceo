import {
  DeploymentUnitOutlined,
  AlignLeftOutlined,
  CompassOutlined
} from "@ant-design/icons";
import { Menu } from "core/components/Layout/Menu";
import AppPage from "core/components/Layout/Pages/AppPage";
import PageHeader from "core/components/PageHeader";
import { PagePanel } from "core/components/PagePanel";
import { MenuRoute } from "types/navigation";

export const AppExploreNavigationPage = ({ children }) => {
  const menu: MenuRoute[] = [
    {
      href: "/app/:id/:slug/explore/logs",
      label: "Logs",
      key: "logs",
      icon: <AlignLeftOutlined />
    },
    {
      href: "/app/:id/:slug/explore/runtime",
      label: "Runtime configuration",
      key: "runtime",
      icon: <DeploymentUnitOutlined />
    }
  ];

  return (
    <>
      <AppPage>
        <PageHeader
          icon={<CompassOutlined />}
          title={"Explore"}
          subTitle={"Explore informations about this app"}
        />

        <Menu className=" mt-5" routes={menu} />
        <PagePanel className="mt-0 rounded-none rounded-b-md">{children}</PagePanel>
      </AppPage>
    </>
  );
};

export default AppExploreNavigationPage;

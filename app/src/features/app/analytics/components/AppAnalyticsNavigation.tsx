import { DeploymentUnitOutlined, BarChartOutlined } from "@ant-design/icons";
import { Menu } from "core/components/Layout/Menu";
import AppPage from "core/components/Layout/Pages/AppPage";
import PageHeader from "core/components/PageHeader";
import { PagePanel } from "core/components/PagePanel";
import { MenuRoute } from "types/navigation";

export const AppAnalyticsNavigationPage = ({ children }) => {
  const menu: MenuRoute[] = [
    {
      href: "/app/:id/:slug/analytics/runtime",
      label: "Runtime configuration",
      key: "runtime",
      icon: <DeploymentUnitOutlined />
    }
  ];

  return (
    <>
      <AppPage>
        <PageHeader
          icon={<BarChartOutlined />}
          title={"Analytics"}
          subTitle={"Information about the health of your application"}
        />

        <Menu className=" mt-5" routes={menu} />
        <PagePanel className="mt-0 rounded-none rounded-b-md">{children}</PagePanel>
      </AppPage>
    </>
  );
};

export default AppAnalyticsNavigationPage;

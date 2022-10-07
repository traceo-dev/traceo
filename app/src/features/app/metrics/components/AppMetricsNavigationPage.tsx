import { BarChartOutlined } from "@ant-design/icons";
import AppPage from "features/app/components/AppPage";
import PageHeader from "core/components/PageHeader";
import { PagePanel } from "core/components/PagePanel";

export const AppMetricsNavigationPage = ({ children }) => {
  return (
    <>
      <AppPage>
        <PageHeader
          icon={<BarChartOutlined />}
          title={"Metrics"}
          subTitle={"Explore informations about this app"}
        />
        <PagePanel className="mt-0 rounded-none rounded-b-md">{children}</PagePanel>
      </AppPage>
    </>
  );
};

export default AppMetricsNavigationPage;

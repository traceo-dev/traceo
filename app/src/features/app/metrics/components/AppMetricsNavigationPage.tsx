import { BarChartOutlined } from "@ant-design/icons";
import AppPage from "features/app/components/AppPage";
import PageHeader from "core/components/PageHeader";

export const AppMetricsNavigationPage = ({ children }) => {
  return (
    <>
      <AppPage>
        <PageHeader
          icon={<BarChartOutlined />}
          title={"Metrics"}
          subTitle={"Explore informations about this app"}
        />
        {children}
      </AppPage>
    </>
  );
};

export default AppMetricsNavigationPage;

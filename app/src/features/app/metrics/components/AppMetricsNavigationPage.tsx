import { BarChartOutlined } from "@ant-design/icons";
import AppPage from "../../../../features/app/components/AppPage";
import PageHeader from "../../../../core/components/PageHeader";

export const AppMetricsNavigationPage = ({ children }) => {
  return (
    <>
      <AppPage>
        <PageHeader
          icon={<BarChartOutlined />}
          title="Metrics"
          subTitle="View metrics from your app after connecting and configuring the SDK"
        />
        {children}
      </AppPage>
    </>
  );
};

export default AppMetricsNavigationPage;

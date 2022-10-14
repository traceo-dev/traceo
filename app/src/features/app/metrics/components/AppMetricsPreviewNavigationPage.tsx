import { BarChartOutlined } from "@ant-design/icons";
import PageHeader from "core/components/PageHeader";
import AppPage from "features/app/components/AppPage";
import { handleHeaderInfo } from "types/metrics";

export const AppMetricsPreviewNavigationPage = ({ children }) => {
  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  const info = handleHeaderInfo[type];

  return (
    <>
      <AppPage>
        <PageHeader icon={<BarChartOutlined />} {...info} />
        {children}
      </AppPage>
    </>
  );
};

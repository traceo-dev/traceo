import { BarChartOutlined } from "@ant-design/icons";
import PageHeader from "core/components/PageHeader";
import AppPage from "features/app/components/AppPage";
import { METRIC_TYPE } from "types/metrics";

export const AppMetricsPreviewNavigationPage = ({ children }) => {
  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  const handleHeaderInfo = {
    [METRIC_TYPE.CPU]: {
      title: "CPU Usage",
      subTitle:
        "CPU usage is the percentage of time that the CPU is being used to complete its tasks."
    },
    [METRIC_TYPE.MEMORY]: {
      title: "Memory Usage",
      subTitle: "The amount of RAM memory being used."
    }
  };

  return (
    <>
      <AppPage>
        <PageHeader icon={<BarChartOutlined />} {...handleHeaderInfo[type]} />
        {children}
      </AppPage>
    </>
  );
};

import { ClockCircleOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { ConditionLayout } from "src/core/components/ConditionLayout";
import { PagePanel } from "src/core/components/PagePanel";
import { TodayIncidentAnalyticsPlot } from "src/core/components/Plots/components/TodayIncidentAnalyticsPlot";
import { TotalIncidentAnalyticsPlot } from "src/core/components/Plots/components/TotalIncidentAnalyticsPlot";
import dateUtils from "src/core/utils/date";
import { StoreState } from "src/types/store";
import AppIncidentNavigationPage from "./components/AppIncidentNavigationPage";

export const AppIncidentAnalyticsPage = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <AppIncidentNavigationPage>
      <ConditionLayout isLoading={!incident}>
        <PagePanel>
          <Space direction="vertical" className="gap-0">
            <Typography.Title className="text-3xl">Today</Typography.Title>
            <Typography className="text-xs pt-3">
              <ClockCircleOutlined /> {dateUtils.getNow("HH:mm")}
            </Typography>
          </Space>
          <TodayIncidentAnalyticsPlot incident={incident} />
        </PagePanel>
        <PagePanel>
          <Typography.Title className="text-3xl">Total overview</Typography.Title>
          <TotalIncidentAnalyticsPlot incident={incident} />
        </PagePanel>
      </ConditionLayout>
    </AppIncidentNavigationPage>
  );
};

export default AppIncidentAnalyticsPage;
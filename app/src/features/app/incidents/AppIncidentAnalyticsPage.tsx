import { ClockCircleOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { IncidentsOverviewPlot } from "../../../core/components/Plots/components/IncidentsOverviewPlot";
import { IncidentsTodayPlot } from "../../../core/components/Plots/components/IncidentsTodayPlot";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { useApi } from "../../../core/lib/useApi";
import { statistics } from "../../../core/utils/statistics";
import { useSelector } from "react-redux";
import { ConditionLayout } from "../../../core/components/ConditionLayout";
import { PagePanel } from "../../../core/components/PagePanel";
import dateUtils from "../../../core/utils/date";
import { StoreState } from "../../../types/store";
import AppIncidentNavigationPage from "./components/AppIncidentNavigationPage";
import { TodayIncidentsStats } from "./components/TodayIncidentsStats";

export const AppIncidentAnalyticsPage = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  const queryParams = {
    id: incident?.id
  };

  const { data: stats = [] } = useApi<
    {
      date: number;
      count: number;
    }[]
  >({
    url: "/api/statistics/incident/total",
    params: queryParams
  });

  const todayStats = statistics.getIncidentsAnalyticsTodayPlotData(
    incident?.occurDates || []
  );

  if (!incident?.occurDates || !stats) {
    return <TraceoLoading />;
  }

  return (
    <AppIncidentNavigationPage>
      <ConditionLayout isLoading={!incident}>
        <PagePanel
          title={
            <Space>
              <Typography.Text>Today Incident overview</Typography.Text>
              <Typography.Text className="text-xs pl-5">
                <ClockCircleOutlined className="mr-1" /> {dateUtils.getNow("HH:mm")}
              </Typography.Text>
            </Space>
          }
        >
          <div className="w-full overflow-hidden">
            <div className="w-3/4 float-left">
              <IncidentsTodayPlot stats={todayStats?.data} />
            </div>
            <div className="w-1/4 float-right">
              <TodayIncidentsStats
                count={todayStats?.count}
                last={todayStats?.last}
                isMore={todayStats?.diff?.isMore}
                value={todayStats?.diff?.value}
              />
            </div>
          </div>
        </PagePanel>
        <PagePanel title="Total Incident overview">
          <Space className="w-full justify-between p-5">
            <Space className="w-full gap-0" direction="vertical">
              <Typography className="text-md font-semibold primary">
                Total count
              </Typography>
              <Typography className="text-3xl">{incident?.occuredCount}</Typography>
              <Typography className="text-xs">
                The total count of this exception occurred
              </Typography>
            </Space>
          </Space>
          <IncidentsOverviewPlot stats={stats} />
        </PagePanel>
      </ConditionLayout>
    </AppIncidentNavigationPage>
  );
};

export default AppIncidentAnalyticsPage;

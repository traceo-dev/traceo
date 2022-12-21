import { IncidentsOverviewPlot } from "../../../core/components/Plots/components/IncidentsOverviewPlot";
import { IncidentsTodayPlot } from "../../../core/components/Plots/components/IncidentsTodayPlot";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { statisticUtils } from "../../../core/utils/statistics";
import { useSelector } from "react-redux";
import { PagePanel } from "../../../core/components/PagePanel";
import { StoreState } from "../../../types/store";
import AppIncidentNavigationPage from "./components/AppIncidentNavigationPage";
import { Space, Tooltip, Typography } from "antd";
import dateUtils from "../../../core/utils/date";
import { StatPercent } from "../../../core/components/StatPercent";

export const AppIncidentAnalyticsPage = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  const todayStats = statisticUtils.parseIncidentsAnalyticsTodayPlotData(
    incident?.errorsDetails || []
  );

  if (!incident?.errorsDetails) {
    return <TraceoLoading />;
  }

  return (
    <AppIncidentNavigationPage>
      <div className="grid grid-cols-5 w-full mb-2">
        <div className="col-span-4 h-full">
          <PagePanel title="Today">
            <IncidentsTodayPlot stats={todayStats?.data} />
          </PagePanel>
        </div>
        <div className="col-span-1 ml-2">
          <div className="flex flex-col items-stretch h-full">
            <div className="h-full mb-1">
              <PagePanel title="Errors count">
                <Space className="w-full font-semibold">
                  <Typography className="text-4xl">{todayStats?.count}</Typography>
                  <Tooltip title="Day-to-day difference">
                    <div>
                      <StatPercent
                        type={todayStats?.diff?.isMore ? "warning" : "success"}
                      >
                        {todayStats?.diff?.isMore ? "+" : ""}
                        {todayStats?.diff?.value}
                      </StatPercent>
                    </div>
                  </Tooltip>
                </Space>
              </PagePanel>
            </div>
            <div className="h-full mt-1">
              <PagePanel className="h-full" title="Last seen">
                <Typography className="text-4xl font-semibold">
                  {dateUtils.formatDate(todayStats?.last, "HH:mm")}
                </Typography>
              </PagePanel>
            </div>
          </div>
        </div>
      </div>
      <PagePanel title="Total overview">
        <IncidentsOverviewPlot stats={incident.errorsDetails} />
      </PagePanel>
    </AppIncidentNavigationPage>
  );
};

export default AppIncidentAnalyticsPage;

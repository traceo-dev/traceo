import { IncidentsOverviewPlot } from "../../../core/components/Plots/components/IncidentsOverviewPlot";
import { IncidentsTodayPlot } from "../../../core/components/Plots/components/IncidentsTodayPlot";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { statisticUtils } from "../../../core/utils/statistics";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import AppIncidentNavigationPage from "./components/AppIncidentNavigationPage";
import { Tooltip } from "antd";
import dateUtils from "../../../core/utils/date";
import { StatPercent } from "../../../core/components/StatPercent";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { Space } from "core/ui-components/Space";

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
      <div className="grid grid-cols-5 w-full mb-1">
        <div className="col-span-4 h-full">
          <Card title="Today">
            <IncidentsTodayPlot stats={todayStats?.data} />
          </Card>
        </div>
        <div className="col-span-1 ml-1">
          <div className="flex flex-col items-stretch h-full">
            <div className="h-full mb-1">
              <Card title="Errors count">
                <Space className="w-full font-semibold">
                  <Typography size="xxl">{todayStats?.count}</Typography>
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
              </Card>
            </div>
            <div className="h-full">
              <Card className="h-full" title="Last seen">
                <Typography size="xxl" weight="semibold">
                  {dateUtils.formatDate(todayStats?.last, "HH:mm")}
                </Typography>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Card title="Total overview">
        <IncidentsOverviewPlot stats={incident.errorsDetails} />
      </Card>
    </AppIncidentNavigationPage>
  );
};

export default AppIncidentAnalyticsPage;

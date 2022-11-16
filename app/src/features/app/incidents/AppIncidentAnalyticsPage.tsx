import { IncidentsOverviewPlot } from "../../../core/components/Plots/components/IncidentsOverviewPlot";
import { IncidentsTodayPlot } from "../../../core/components/Plots/components/IncidentsTodayPlot";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { useApi } from "../../../core/lib/useApi";
import { statistics } from "../../../core/utils/statistics";
import { useSelector } from "react-redux";
import { ConditionLayout } from "../../../core/components/ConditionLayout";
import { PagePanel } from "../../../core/components/PagePanel";
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
    incident?.errorsDetails || []
  );

  if (!incident?.errorsDetails || !stats) {
    return <TraceoLoading />;
  }

  return (
    <AppIncidentNavigationPage>
      <ConditionLayout isLoading={!incident}>
        <PagePanel title="Today">
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
        <PagePanel title="Total overview">
          <IncidentsOverviewPlot stats={stats} />
        </PagePanel>
      </ConditionLayout>
    </AppIncidentNavigationPage>
  );
};

export default AppIncidentAnalyticsPage;

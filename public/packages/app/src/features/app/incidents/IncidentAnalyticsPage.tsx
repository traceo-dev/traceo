import { AppIncidentsTodayPlot, AppOverviewPlot } from "../../../core/components/Plots";
import dateUtils from "../../../core/utils/date";
import { statisticUtils } from "../../../core/utils/statistics";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { StoreState } from "@store/types";
import { Typography, Card } from "@traceo/ui";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const IncidentAnalyticsPage = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  const dataSource = useMemo(() => {
    return statisticUtils.parseIncidentsAnalyticsTodayPlotData(incident?.errorsDetails || []);
  }, [incident?.errorsDetails]);

  return (
    <IncidentPageWrapper>
      <div className="grid grid-cols-5 w-full mb-1">
        <div className="col-span-4 h-full">
          <Card title="Today" className="h-full">
            <AppIncidentsTodayPlot stats={dataSource?.data} />
          </Card>
        </div>
        <div className="col-span-1 ml-1">
          <div className="flex flex-col items-stretch h-full">
            <div className="h-full mb-1">
              <Card title="Errors count" className="h-full">
                <Typography size="xxl" weight="semibold">
                  {dataSource?.count}
                </Typography>
              </Card>
            </div>
            <div className="h-full">
              <Card className="h-full" title="Last seen">
                <Typography size="xxl" weight="semibold">
                  {dateUtils.formatDate(dataSource?.last, "HH:mm")}
                </Typography>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Card title="Total overview">
        <AppOverviewPlot stats={incident.errorsDetails} />
      </Card>
    </IncidentPageWrapper>
  );
};

export default IncidentAnalyticsPage;

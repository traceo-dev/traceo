import { SyncOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useApi } from "../../../../core/lib/useApi";
import { PagePanel } from "../../../../core/components/PagePanel";
import { IncidentsTodayPlot } from "../../../../core/components/Plots/components/IncidentsTodayPlot";
import { ErrorDetails } from "../../../../types/incidents";
import { statisticUtils } from "../../../../core/utils/statistics";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import dateUtils from "../../../../core/utils/date";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { Typography } from "core/ui-components/Typography/Typography";

export const TodaySection = () => {
  const { id } = useParams();
  const { application } = useSelector((state: StoreState) => state.application);

  const {
    data: stats,
    isLoading,
    execute: get
  } = useApi<ErrorDetails[]>({
    url: "/api/statistics/daily",
    params: {
      id
    }
  });

  const reloadDailyStats = () => {
    get();
  };

  const lastIncidentAt =
    application?.lastIncidentAt && dateUtils.isTodayDate(application?.lastIncidentAt)
      ? dateUtils.formatDate(application?.lastIncidentAt, "HH:mm")
      : "--:--";

  return (
    <div className="grid grid-cols-5 w-full mb-2">
      <div className="col-span-4 h-full">
        <PagePanel title="Today">
          <ConditionalWrapper isLoading={isLoading}>
            <IncidentsTodayPlot
              stats={statisticUtils.parseErrorsToTodayPlotSource(stats).data}
            />
          </ConditionalWrapper>
        </PagePanel>
      </div>
      <div className="col-span-1 ml-2">
        <div className="flex flex-col items-stretch h-full">
          <div className="h-full mb-1">
            <PagePanel
              title="Errors count"
              extra={
                <SyncOutlined className="text-xs" onClick={() => reloadDailyStats()} />
              }
            >
              <ConditionalWrapper isLoading={isLoading}>
                <Typography size="xxl" weight="semibold">
                  {statisticUtils.parseErrorsToTodayPlotSource(stats).count}
                </Typography>
              </ConditionalWrapper>
            </PagePanel>
          </div>
          <div className="h-full mt-1">
            <PagePanel className="h-full" title="Last seen">
              <ConditionalWrapper isLoading={isLoading}>
                <Typography size="xxl" weight="semibold" className="text-center">
                  {lastIncidentAt}
                </Typography>
              </ConditionalWrapper>
            </PagePanel>
          </div>
        </div>
      </div>
    </div>
  );
};

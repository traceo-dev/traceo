import { SyncOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useRequest } from "../../../../core/hooks/useRequest";
import { ErrorDetails } from "../../../../types/incidents";
import { statisticUtils } from "../../../../core/utils/statistics";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import dateUtils from "../../../../core/utils/date";
import { Typography } from "../../../../core/ui-components/Typography";
import { Card } from "../../../../core/ui-components/Card";
import { AppIncidentsTodayPlot } from "../../../../core/components/Plots";
import { useApplication } from "../../../../core/hooks/useApplication";

export const TodaySection = () => {
  const { id } = useParams();
  const { application } = useApplication();

  const {
    data: dataSource,
    isLoading,
    execute: reloadDailyStats
  } = useRequest<ErrorDetails[]>({
    url: "/api/statistics/daily",
    params: {
      id
    }
  });

  const lastIncidentAt =
    application?.lastIncidentAt && dateUtils.isTodayDate(application?.lastIncidentAt)
      ? dateUtils.formatDate(application?.lastIncidentAt, "HH:mm")
      : "--:--";

  return (
    <div className="grid grid-cols-5 w-full mb-1">
      <div className="col-span-4 h-full">
        <Card title="Today">
          <ConditionalWrapper isLoading={isLoading}>
            <AppIncidentsTodayPlot
              stats={statisticUtils.parseErrorsToTodayPlotSource(dataSource).data}
            />
          </ConditionalWrapper>
        </Card>
      </div>
      <div className="col-span-1 ml-1">
        <div className="flex flex-col items-stretch h-full">
          <div className="h-full mb-1">
            <Card
              title="Errors count"
              extra={
                <SyncOutlined className="text-xs" onClick={() => reloadDailyStats()} />
              }
            >
              <ConditionalWrapper isLoading={isLoading}>
                <Typography size="xxl" weight="semibold">
                  {statisticUtils.parseErrorsToTodayPlotSource(dataSource).count || 0}
                </Typography>
              </ConditionalWrapper>
            </Card>
          </div>
          <div className="h-full">
            <Card className="h-full" title="Last seen">
              <ConditionalWrapper isLoading={isLoading}>
                <Typography size="xxl" weight="semibold" className="text-center">
                  {lastIncidentAt}
                </Typography>
              </ConditionalWrapper>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

import { BugOutlined, WarningFilled, WarningOutlined } from "@ant-design/icons";
import { loadApplication } from "../../../features/app/state/application/actions";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IncidentsAppListPlot } from "../../../core/components/Plots/components/IncidentsAppListPlot";
import dateUtils from "../../../core/utils/date";
import { dispatch } from "../../../store/store";
import { Application, MemberApplication } from "../../../types/application";
import { Typography } from "core/ui-components/Typography";
import { ListCard } from "core/ui-components/Card/ListCard";
import { Space } from "core/ui-components/Space";
import { Avatar } from "core/ui-components/Avatar";
import { Tooltip } from "core/ui-components/Tooltip";

interface Props {
  app: MemberApplication;
}
export const AppCard: FC<Props> = ({ app }) => {
  const navigate = useNavigate();

  const openApplication = () => {
    dispatch(loadApplication(app.appId));
    navigate(`/app/${app.appId}/overview`);
  };

  return (
    <ListCard onClick={openApplication} className="flex flex-col">
      <Space className="w-full justify-between">
        <Space>
          <Avatar alt={app.name} src={app?.gravatar} />
          <Space className="w-full pl-2 gap-0" direction="vertical">
            <div className="w-full flex flex-row">
              <Typography className="cursor-pointer" weight="semibold">
                {app.name}
              </Typography>
              {!app.isIntegrated && (
                <Tooltip title="Not integrated with Traceo SDK">
                  <WarningFilled className="ml-2 text-red-500" />
                </Tooltip>
              )}
            </div>
            <AppDetails {...app} />
          </Space>
        </Space>
        <IncidentsAppListPlot id={app.appId} />
      </Space>
    </ListCard>
  );
};

const AppDetails = (app: Application) => {
  const lastError = app?.lastIncidentAt
    ? "Last error " + dateUtils.fromNow(app?.lastIncidentAt)
    : "-- : --";

  return (
    <Space className="text-xs">
      <Typography size="xs" className="pipe">
        {lastError}
      </Typography>
      <Tooltip title="Incidents">
        <Typography size="xs" className="pipe">
          <BugOutlined className="pr-1" /> {app?.incidentsCount || 0}
        </Typography>
      </Tooltip>
      <Tooltip title="Errors">
        <Typography size="xs">
          <WarningOutlined className="pr-1" /> {app?.errorsCount || 0}
        </Typography>
      </Tooltip>
    </Space>
  );
};

import { SmallAppIncidentsPlot } from "../../../core/components/Plots";
import dateUtils from "../../../core/utils/date";
import { BugOutlined, WarningFilled, WarningOutlined } from "@ant-design/icons";
import { IApplication, MemberApplication } from "@traceo/types";
import { Typography, ListCard, Space, Avatar, Tooltip } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  app: MemberApplication;
}
export const AppCard: FC<Props> = ({ app }) => {
  const navigate = useNavigate();

  const openApplication = () => {
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
        <SmallAppIncidentsPlot id={app.appId} />
      </Space>
    </ListCard>
  );
};

const AppDetails = (app: IApplication) => {
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

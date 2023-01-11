import { BugOutlined, WarningFilled, WarningOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { loadApplication } from "../../../features/app/state/application/actions";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IncidentsAppListPlot } from "../../../core/components/Plots/components/IncidentsAppListPlot";
import dateUtils from "../../../core/utils/date";
import { slugifyForUrl } from "../../../core/utils/stringUtils";
import { dispatch } from "../../../store/store";
import { ApplicationMember } from "../../../types/application";
import { Typography } from "core/ui-components/Typography/Typography";
import { ListCard } from "core/ui-components/Card/ListCard";
import { Space } from "core/ui-components/Space/Space";
import { Avatar } from "core/ui-components/Avatar/Avatar";

interface Props {
  app: ApplicationMember["application"] & Pick<ApplicationMember, "role">;
}
export const AppCard: FC<Props> = ({ app }) => {
  const navigate = useNavigate();

  const go = () => {
    navigate(`/app/${app.id}/${slugifyForUrl(app.name)}/overview`);
    dispatch(loadApplication(app.id));
  };

  const lastError = app?.lastIncidentAt
    ? "Last error " + dateUtils.fromNow(app?.lastIncidentAt)
    : "-- : --";

  return (
    <>
      <ListCard onClick={() => go()} className="flex flex-col">
        <Space className="w-full justify-between">
          <Space>
            <Avatar alt={app.name} src={app?.gravatar} />
            <Space className="w-full pl-2 gap-0" direction="vertical">
              <div>
                <Typography className="cursor-pointer">{app.name}</Typography>
                {!app.isIntegrated && (
                  <Tooltip title="Not integrated with Traceo SDK">
                    <WarningFilled className="ml-2 text-red-500" />
                  </Tooltip>
                )}
              </div>
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
            </Space>
          </Space>
          <IncidentsAppListPlot id={app.id} />
        </Space>
      </ListCard>
    </>
  );
};

import { BugOutlined, SafetyCertificateFilled } from "@ant-design/icons";
import { Card, Space, Tooltip, Typography } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../../core/components/Avatar";
import { IncidentsAppListPlot } from "../../../core/components/Plots/components/IncidentsAppListPlot";
import dateUtils from "../../../core/utils/date";
import { slugifyForUrl } from "../../../core/utils/stringUtils";
import { loadApplication } from "../../../features/app/state/actions";
import { dispatch } from "../../../store/store";
import { ApplicationMember, MemberRole } from "../../../types/application";

interface Props {
  app: ApplicationMember["application"] & Pick<ApplicationMember, "role">;
}
export const AppCard: FC<Props> = ({ app }) => {
  const navigate = useNavigate();

  const go = () => {
    navigate(`/app/${app.id}/${slugifyForUrl(app.name)}/overview`);
    dispatch(loadApplication(app.id));
    localStorage.setItem("env", app.defaultEnv);
  };

  const lastIncident = app?.lastIncidentAt
    ? "Last incident " + dateUtils.fromNow(app?.lastIncidentAt)
    : "-- : --";

  return (
    <>
      <Card
        onClick={() => go()}
        className="app-card default-card default-card-body rounded-lg flex flex-col"
      >
        <Space className="w-full justify-between">
          <Space>
            <Avatar shape="circle" name={app.name} url={app?.gravatar} />
            <Space className="w-full pl-3 gap-0" direction="vertical">
              <div>
                <Typography.Text className="text-sm">{app.name}</Typography.Text>
                {app.role === MemberRole.ADMINISTRATOR && (
                  <Tooltip title="You're admin!">
                    <SafetyCertificateFilled className="ml-2 text-amber-600" />
                  </Tooltip>
                )}
              </div>
              <Space>
                <div className="text-2xs w-full font-normal">{lastIncident}</div>|
                <BugOutlined />
                <div className="text-2xs w-full font-normal">{app.errorsCount}</div>
              </Space>
            </Space>
          </Space>
          <IncidentsAppListPlot id={app.id} />
        </Space>
      </Card>
    </>
  );
};

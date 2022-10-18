import { SafetyCertificateFilled } from "@ant-design/icons";
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
  app: ApplicationMember;
}
export const AppCard: FC<Props> = ({ app }) => {
  const navigate = useNavigate();

  const go = () => {
    const { application } = app;
    navigate(`/app/${application.id}/${slugifyForUrl(application.name)}/overview`);
    dispatch(loadApplication(application.id));
    localStorage.setItem("env", application.defaultEnv);
  };

  const lastIncident = app.application?.lastIncidentAt
    ? "Last incident " + dateUtils.fromNow(app.application?.lastIncidentAt)
    : "-- : --";

  return (
    <>
      <Card
        onClick={() => go()}
        className="app-card default-card default-card-body rounded-lg flex flex-col"
      >
        <Space className="w-full" direction="vertical">
          <Space>
            <Avatar
              shape="circle"
              name={app.application.name}
              url={app.application?.gravatar}
            />
            <Space className="w-full gap-0" direction="vertical">
              <div>
                <Typography.Text className="text-sm">
                  {app.application.name}
                </Typography.Text>
                {app.role === MemberRole.ADMINISTRATOR && (
                  <Tooltip title="You're admin!">
                    <SafetyCertificateFilled className="ml-2 text-amber-600" />
                  </Tooltip>
                )}
              </div>
              <div className="text-2xs w-full font-normal">{lastIncident}</div>
            </Space>
          </Space>
        </Space>
        <div className="pointer-events-none pt-8">
          <IncidentsAppListPlot id={app.application.id} />
        </div>
      </Card>
      <style>{`
      .app-card {
        min-height: 221px !important;
      }
    `}</style>
    </>
  );
};

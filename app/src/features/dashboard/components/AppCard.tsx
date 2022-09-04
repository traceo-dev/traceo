import { Card, Space, Typography } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "src/core/components/Avatar";
import { AppListPlot } from "src/core/components/Plots/components/AppListPlot";
import dateUtils from "src/core/utils/date";
import { slugifyForUrl } from "src/core/utils/stringUtils";
import { loadApplication } from "src/features/app/state/actions";
import { dispatch } from "src/store/store";
import { AccountApplication } from "src/types/application";

interface Props {
  app: AccountApplication;
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
    <Card
      onClick={() => go()}
      className="default-card default-card-body rounded-lg flex flex-col"
    >
      <Space className="w-full" direction="vertical">
        <Space>
          <Avatar shape="circle" name={app.application.name} url={app.application.logo} />
          <Space className="w-full gap-0" direction="vertical">
            <Typography.Text className="text-sm">{app.application.name}</Typography.Text>
            <div className="text-2xs w-full font-normal">{lastIncident}</div>
          </Space>
        </Space>
      </Space>
      <div className="pointer-events-none pt-8">
        <AppListPlot id={app.application.id} />
      </div>
    </Card>
  );
};
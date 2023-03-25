import dateUtils from "../../../core/utils/date";
import { MemberApplication } from "@traceo/types";
import { Typography, Avatar } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import AppListIncidentsChart from "../../../core/components/Charts/Incidents/AppListIncidentsChart";

interface Props {
  app: MemberApplication;
}
export const AppCard: FC<Props> = ({ app }) => {
  const navigate = useNavigate();

  const openApplication = () => {
    navigate(`/app/${app.appId}/overview`);
  };

  const lastEventAt = app?.lastEventAt
    ? "Last error " + dateUtils.fromNow(app?.lastEventAt)
    : "-- : --";

  return (
    <div
      onClick={openApplication}
      className="md:col-span-2 lg:col-span-4 flex flex-col p-5 m-2 bg-secondary rounded-md cursor-pointer min-h-[190px]"
    >
      <div className="flex flex-row items-center">
        <Avatar alt={app.name} src={app?.gravatar} />
        <div className="flex flex-col pl-3">
          <Typography className="cursor-pointer" weight="semibold">
            {app.name}
          </Typography>
          <span className="text-xs text-primary">{lastEventAt}</span>
        </div>
      </div>

      <div className="pt-9">
        <AppListIncidentsChart id={app.appId} />
      </div>
    </div>
  );
};

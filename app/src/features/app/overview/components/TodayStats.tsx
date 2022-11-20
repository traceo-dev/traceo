import { Space, Statistic, Typography, Divider } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import dateUtils from "../../../../core/utils/date";
import { DailyStats } from "../../../../types/statistics";
import { StoreState } from "../../../../types/store";

interface Props {
  stats: DailyStats;
}
export const TodayStats: FC<Props> = ({ stats }) => {
  const { application } = useSelector((state: StoreState) => state.application);

  const lastIncidentAt =
    application?.lastIncidentAt && dateUtils.isTodayDate(application?.lastIncidentAt)
      ? dateUtils.formatDate(application?.lastIncidentAt, "HH:mm")
      : "--:--";
  return (
    <>
      <Space className="today-stats" direction="vertical">
        <Space className="w-full py-4 gap-0 pl-8" direction="vertical">
          <Statistic
            title="Errors count"
            className="font-semibold"
            value={stats?.count}
          />
          <Typography className="text-xs w-full pt-1">
            The number of today&apos;s errors
          </Typography>
        </Space>
        <Divider className="p-0 m-0 bg-gray-200" />
        <Space className="w-full py-4 gap-0 pl-8" direction="vertical">
          <Statistic title="Last seen" className="font-semibold" value={lastIncidentAt} />
        </Space>
      </Space>
      <style>{`
        .today-stats {
          border-left: 1px solid #cacaca;
          height: 100%;
        }
      `}</style>
    </>
  );
};

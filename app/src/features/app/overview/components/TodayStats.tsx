import { Space, Statistic, Typography, Divider } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import { TextLabel } from "src/core/components/TextLabel";
import dateUtils from "src/core/utils/date";
import { DailyStats } from "src/types/statistics";
import { StoreState } from "src/types/store";

interface Props {
  stats: DailyStats;
}
export const TodayStats: FC<Props> = ({ stats }) => {
  const { application } = useSelector((state: StoreState) => state.application);

  return (
    <>
      <Space className="today-stats" direction="vertical">
        <Space className="w-full py-4 gap-0 pl-8" direction="vertical">
          <Statistic
            title={<TextLabel className="font-medium" label="Incidents count" />}
            className="font-semibold"
            value={stats?.count}
          />
          <Typography className="text-xs w-full pt-1">
            Total count of today&apos;s incidents
          </Typography>
        </Space>
        <Divider className="p-0 m-0 bg-gray-200" />
        <Space className="w-full py-4 gap-0 pl-8" direction="vertical">
          <Statistic
            title={<TextLabel className="font-medium" label="Last seen" />}
            className="font-semibold"
            value={
              application?.lastIncidentAt &&
              dateUtils.isTodayDate(application?.lastIncidentAt)
                ? dateUtils.formatDate(application?.lastIncidentAt, "HH:mm")
                : "--:--"
            }
          />
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

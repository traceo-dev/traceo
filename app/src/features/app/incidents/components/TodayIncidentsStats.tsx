import { Space, Typography, Tooltip, Divider } from "antd";
import { FC } from "react";
import dateUtils from "../../../../core/utils/date";
import { StatPercent } from "../../../../core/components/StatPercent";

interface Props {
  count: number;
  last: number;
  isMore: boolean;
  value: string;
}
export const TodayIncidentsStats: FC<Props> = ({ count, last, isMore, value }) => {
  return (
    <Space
      style={{ borderLeft: "1px solid #CACACA" }}
      className="w-full ml-6 h-full"
      direction="vertical"
    >
      <Space className="w-full py-4 gap-0 pl-8" direction="vertical">
        <Typography className="text-md text-primary font-semibold">
          Errors count
        </Typography>
        <Space className="w-full">
          <Typography className="text-3xl">{count}</Typography>
          <Tooltip title="Day-to-day difference">
            <div>
              <StatPercent type={isMore ? "warning" : "success"}>
                {isMore ? "+" : ""}
                {value}
              </StatPercent>
            </div>
          </Tooltip>
        </Space>
      </Space>
      <Divider className="p-0 m-0 bg-gray-200" />
      <Space className="w-full py-4 gap-0 pl-8" direction="vertical">
        <Typography className="text-md font-semibold text-primary">Last at</Typography>
        <Typography className="text-3xl">
          {dateUtils.formatDate(last, "HH:mm")}
        </Typography>
      </Space>
    </Space>
  );
};

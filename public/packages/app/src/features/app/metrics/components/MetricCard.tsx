import { QuestionCircleOutlined } from "@ant-design/icons";
import { IMetric } from "@traceo/types";
import { Space, Tooltip } from "@traceo/ui";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricChart from "../../../../core/components/Charts/Metrics/MetricChart";

interface MetricCardProps {
  metric: IMetric;
  ranges: [number, number];
}
export const MetricCard: FC<MetricCardProps> = ({ metric, ranges }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const onClick = () => {
    navigate({
      pathname: `/app/${id}/metrics/preview/${metric.id}`,
      search: `?from=${ranges[0]}&to=${ranges[1]}`
    });
  };

  return (
    <div className="pb-5 cursor-pointer rounded-md bg-primary">
      <Space className="w-full" direction="vertical" onClick={onClick}>
        <div className="flex flex-row border-bottom p-4 items-center">
          <span className="text-sm pr-2">{metric?.name}</span>
          <Tooltip title={metric?.description}>
            <QuestionCircleOutlined className="text-xs" />
          </Tooltip>
        </div>
        <div className="p-2">
          <MetricChart metric={metric} ranges={ranges} />
        </div>
      </Space>
    </div>
  );
};

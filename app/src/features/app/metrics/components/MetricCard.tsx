import { QuestionCircleOutlined } from "@ant-design/icons";
import { MetricPlot } from "../../../../core/components/Plots/components/Metrics/MetricPlot";
import { FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IMetric } from "../../../../types/metrics";
import { StoreState } from "../../../../types/store";
import { Typography } from "core/ui-components/Typography";
import { Space } from "core/ui-components/Space";
import { Tooltip } from "core/ui-components/Tooltip";

interface MetricCardProps {
  metric: IMetric;
  hrCount: number;
}
export const MetricCard: FC<MetricCardProps> = ({ metric, hrCount }) => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.application);

  const onClick = () => {
    navigate(`/app/${application.id}/metrics/preview/${metric.id}?name=${metric.name}`);
  };

  return (
    <div className="h-60 border border-solid border-secondary p-2 cursor-pointer rounded-md hover:bg-secondary">
      <Space className="w-full" direction="vertical" onClick={onClick}>
        <Space className="w-full pb-5 pt-1 justify-center">
          <Typography>{metric?.name}</Typography>
          {metric?.description && (
            <Tooltip title={metric?.description}>
              <QuestionCircleOutlined className="text-xs" />
            </Tooltip>
          )}
        </Space>

        <MetricPlot metric={metric} hrCount={hrCount} />
      </Space>
    </div>
  );
};

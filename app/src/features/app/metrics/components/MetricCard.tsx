import { QuestionCircleOutlined } from "@ant-design/icons";
import { Space, Typography, Tooltip } from "antd";
import { MetricPlot } from "../../../../core/components/Plots/components/Metrics/MetricPlot";
import { slugifyForUrl } from "../../../../core/utils/stringUtils";
import { FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IMetric } from "../../../../types/metrics";
import { StoreState } from "../../../../types/store";

interface MetricCardProps {
  metric: IMetric;
  hrCount: number;
}
export const MetricCard: FC<MetricCardProps> = ({ metric, hrCount }) => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.application);

  const onClick = () => {
    navigate(
      `/app/${application.id}/${slugifyForUrl(application.name)}/metrics/preview/${
        metric.id
      }?name=${slugifyForUrl(metric.name)}`
    );
  };

  return (
    <>
      <div className="p-2 metric-panel">
        <Space className="w-full" direction="vertical" onClick={onClick}>
          <Space className="w-full pb-5 pt-1 justify-center">
            <Typography.Text className="text-md">{metric?.name}</Typography.Text>
            {metric?.description && (
              <Tooltip title={metric?.description}>
                <QuestionCircleOutlined className="text-xs" />
              </Tooltip>
            )}
          </Space>

          <MetricPlot metric={metric} hrCount={hrCount} />
        </Space>
      </div>

      <style>{`
          .metric-panel {
            cursor: pointer;
            // background-color: var(--color-bg-secondary);
            border: 1px solid var(--color-bg-secondary);
            border-radius: 3px;
            box-shadow: rgb(24 26 27 / 75%) 0px 1px 2px;
            min-width: 100%;
            height: 240px;
            margin-bottom: 7px;
          }
          
          .metric-panel:hover {
            background-color: var(--color-bg-secondary);
            transition: .2s;
          }
        `}</style>
    </>
  );
};

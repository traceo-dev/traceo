import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { IMetric, MetricPreviewType } from "@traceo/types";
import { Row, Space, Tooltip } from "@traceo/ui";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricChart from "../../../../core/components/Charts/Metrics/MetricChart";
import { useReactQuery } from "src/core/hooks/useReactQuery";

interface MetricCardProps {
  metric: IMetric;
  ranges: [number, number];
}
export const MetricCard: FC<MetricCardProps> = ({ metric, ranges }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const seriesFields = metric.series.map(({ field }) => field) || [""];
  const { data, refetch, isLoading, isRefetching } = useReactQuery<MetricPreviewType>({
    queryKey: [`metric_ds_${metric.id}`],
    url: `/api/metrics/${id}/preview/${metric.id}`,
    params: {
      fields: seriesFields,
      from: ranges[0],
      to: ranges[1]
    }
  });

  useEffect(() => {
    refetch();
  }, [ranges, metric]);

  const onClick = () => {
    navigate({
      pathname: `/project/${id}/metrics/preview/${metric.id}`,
      search: `?from=${ranges[0]}&to=${ranges[1]}`
    });
  };

  return (
    <div className="p-3 cursor-pointer bg-primary">
      <Space className="w-full" direction="vertical" onClick={onClick}>
        <Row className="w-full mb-3 justify-between">
          <Row>
            <span className="text-[14px] pr-2">{metric?.name}</span>
            <Tooltip title={metric?.description}>
              <QuestionCircleOutlined className="text-xs" />
            </Tooltip>
          </Row>
          {isRefetching && <LoadingOutlined />}
        </Row>
        <MetricChart metric={metric} ranges={ranges} data={data} isLoading={isLoading} />
      </Space>
    </div>
  );
};

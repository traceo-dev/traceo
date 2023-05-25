import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { IMetric, MetricPreviewType, Setter } from "@traceo/types";
import { Row, Space, Tooltip } from "@traceo/ui";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricChart from "../../../../core/components/Charts/Metrics/MetricChart";
import { useReactQuery } from "src/core/hooks/useReactQuery";

interface MetricCardProps {
  metric: IMetric;
  ranges: [number, number];
  setRanges: Setter<[number, number]>;
}
export const MetricCard: FC<MetricCardProps> = ({
  metric,
  ranges = [undefined, undefined],
  setRanges = undefined
}) => {
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
    console.log("click");
    navigate({
      pathname: `/project/${id}/metrics/preview/${metric.id}`,
      search: `?from=${ranges[0]}&to=${ranges[1]}`
    });
  };

  return (
    <div className="cursor-pointer p-1 bg-primary">
      <Space className="w-full" direction="vertical">
        <Row
          className="w-full mb-2 py-2 px-3 justify-between hover:bg-secondary rounded"
          onClick={onClick}
        >
          <Row>
            <span className="text-[14px] pr-2 text-primary font-[500]">{metric?.name}</span>

            {metric.description && (
              <Tooltip title={metric?.description}>
                <QuestionCircleOutlined className="text-xs" />
              </Tooltip>
            )}
          </Row>
          {isRefetching && <LoadingOutlined />}
        </Row>
        <div className="p-3">
          <MetricChart
            metric={metric}
            ranges={ranges}
            setRanges={setRanges}
            data={data}
            isLoading={isLoading}
          />
        </div>
      </Space>
    </div>
  );
};

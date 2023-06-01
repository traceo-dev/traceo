import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { IMetric, MetricPreviewType, Setter, TimeRange } from "@traceo/types";
import { Card } from "@traceo/ui";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricChart from "../../../../core/components/Charts/Metrics/MetricChart";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";

interface MetricCardProps {
  metric: IMetric;
  ranges: TimeRange;
  setRanges: Setter<TimeRange>;
}
export const MetricCard: FC<MetricCardProps> = ({
  metric,
  ranges = [undefined, undefined],
  setRanges = undefined
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isHover, setHover] = useState<boolean>(false);

  const seriesFields = metric.series.map(({ field }) => field) || [""];
  const { data, refetch, isLoading, isRefetching } = useReactQuery<MetricPreviewType>({
    queryKey: [`metric_ds_${metric.id}`],
    url: `/api/metrics/${id}/preview/${metric.id}`,
    params: {
      fields: seriesFields,
      from: ranges[0],
      to: ranges[1]
    },
    options: {
      keepPreviousData: true,
      refetchOnMount: false
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

  const onRefresh = (e: any) => {
    e.stopPropagation();
    refetch();
  };

  return (
    <Card
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="col-span-6 min-w-[200px]"
      title={metric.name}
      onClick={() => onClick()}
      extra={
        (isHover || isRefetching) &&
        (isRefetching ? (
          <LoadingOutlined className="text-[12px]" />
        ) : (
          <ReloadOutlined className="text-[12px]" onClick={onRefresh} />
        ))
      }
    >
      <MetricChart
        metric={metric}
        ranges={ranges}
        setRanges={setRanges}
        data={data}
        isLoading={isLoading}
      />
    </Card>
  );
};

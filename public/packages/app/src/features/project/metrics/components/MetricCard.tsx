import { ReloadOutlined } from "@ant-design/icons";
import { IMetric, Setter, TimeRange } from "@traceo/types";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { MetricPanel } from "../../../../core/components/Panels/MetricPanel";

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
  const { data, refetch, isLoading, isRefetching } = useReactQuery<any>({
    queryKey: [`metric_ds_${metric.id}`],
    url: `/api/metrics/${id}/preview/${metric.id}`,
    params: {
      fields: seriesFields,
      from: ranges[0],
      to: ranges[1]
    },
    options: {
      refetchOnMount: false,
      retryOnMount: false
    }
  });

  useEffect(() => {
    refetch();
  }, [ranges, metric]);

  const onZoom = (ranges: TimeRange) => {
    setRanges(ranges);
  };

  const onNavigate = () => {
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
    <MetricPanel
      height={180}
      panelName={<span onClick={() => onNavigate()}>{metric?.name}</span>}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      datasource={data?.datasource}
      metric={data?.options || metric}
      extra={
        isHover && !isRefetching && <ReloadOutlined className="text-[10px]" onClick={onRefresh} />
      }
      isLoading={isLoading || isRefetching}
      onZoom={onZoom}
      className="col-span-6 min-w-[200px]"
    />
  );
};

import { ReloadOutlined } from "@ant-design/icons";
import { IMetric, Setter, TimeRange } from "@traceo/types";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { BaseMetricChart } from "../../../../core/components/UPlot/BaseMetricChart";
import { DashboardPanel } from "src/core/components/DashboardPanel";

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

  return (
    <DashboardPanel
      name={metric?.name}
      loading={isLoading || isRefetching}
      className="col-span-6 min-w-[200px]"
      navigateTo={{
        pathname: `/project/${id}/metrics/preview/${metric.id}`,
        search: `?from=${ranges[0]}&to=${ranges[1]}`
      }}
    >
      <BaseMetricChart
        height={180}
        datasource={data?.datasource}
        metric={data?.options || metric}
        isLoading={isLoading || isRefetching}
        onZoom={onZoom}
      />
    </DashboardPanel>
  );
};

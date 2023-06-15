import { ReloadOutlined } from "@ant-design/icons";
import { IMetric, Setter, TimeRange } from "@traceo/types";
import { conditionClass, joinClasses } from "@traceo/ui";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { UPlotMetricsCardGraph } from "./UplotMetricCardGraph";

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
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={joinClasses(
        "flex flex-col col-span-6 min-w-[200px] rounded border border-solid border-secondary bg-primary mb-1",
        conditionClass(isRefetching || isLoading, "loading-border")
      )}
    >
      <div
        className="cursor-pointer w-full p-3 border-bottom justify-between flex flex-row items-center"
        onClick={() => onNavigate()}
      >
        <span className="text-[14px] font-semibold">{metric.name}</span>
        <div className="text-[10px]">
          {isHover && !isRefetching && <ReloadOutlined onClick={onRefresh} />}
        </div>
      </div>
      <UPlotMetricsCardGraph
        datasource={data?.datasource || []}
        metric={data?.options || metric}
        onZoom={onZoom}
      />
    </div>
  );
};

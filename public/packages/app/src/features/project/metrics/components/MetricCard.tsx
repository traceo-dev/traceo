import { LoadingOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { IMetric, MetricPreviewType, Setter, TimeRange } from "@traceo/types";
import { Card, Row, Space, Tooltip } from "@traceo/ui";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricChart from "../../../../core/components/Charts/Metrics/MetricChart";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { ColumnSection } from "src/core/components/ColumnSection";

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
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="col-span-6 mb-1 flex flex-col w-full p-4 bg-primary border border-solid border-secondary rounded"
    >
      <div className="flex flex-row justify-between pb-5">
        <Row gap="x-2">
          <span onClick={onClick} className="cursor-pointer font-semibold text-sm">
            {metric.name}
          </span>
          {metric.description && (
            <Tooltip title={metric.description}>
              <QuestionCircleOutlined className="text-xs" />
            </Tooltip>
          )}
        </Row>

        {(isHover || isRefetching) && (
          <div className="text-xs text-primary hover:text-white cursor-pointer">
            {isRefetching ? <LoadingOutlined /> : <ReloadOutlined onClick={onRefresh} />}
          </div>
        )}
      </div>
      <MetricChart
        metric={metric}
        ranges={ranges}
        setRanges={setRanges}
        data={data}
        isLoading={isLoading}
      />
    </div>
    // <Card
    // onMouseEnter={() => setHover(true)}
    // onMouseLeave={() => setHover(false)}
    // className="mb-1 flex flex-col col-span-6"
    //   title={
    //     <span onClick={onClick} className="cursor-pointer text-primary font-semibold">
    //       {metric.name}
    //     </span>
    //   }
    //   extra={
    // (isHover || isRefetching) && (
    //   <div className="text-xs text-primary hover:text-white cursor-pointer">
    //     {isRefetching ? <LoadingOutlined /> : <ReloadOutlined onClick={onRefresh} />}
    //   </div>
    // )
    //   }
    // >
    // <MetricChart
    //   metric={metric}
    //   ranges={ranges}
    //   setRanges={setRanges}
    //   data={data}
    //   isLoading={isLoading}
    // />
    // </Card>
  );
};

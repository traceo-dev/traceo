import { FC, lazy, useEffect, useMemo } from "react";
import { IMetric, MetricsResponse, METRIC_UNIT } from "@traceo/types";
import { MetricLoading } from "../../../MetricLoading";
import { useRequest } from "../../../../hooks/useRequest";
import { ConditionalWrapper } from "../../../ConditionLayout";
import { buildDatasource, buildSeries, commonOptions } from "./utils";
import { DataNotFound } from "../../../DataNotFound";
import { useApplication } from "../../../../hooks/useApplication";

interface Props {
  metric: IMetric;
  ranges: [number, number];
}
const ReactECharts = lazy(() => import("echarts-for-react"));
const MetricPlot: FC<Props> = ({ metric, ranges }) => {
  const { application } = useApplication();

  useEffect(() => {
    execute();
  }, [ranges, metric]);

  const seriesFields = useMemo(() => {
    return (
      metric?.series?.reduce<string[]>((acc, serie) => {
        acc.push(serie.field);

        return acc;
      }, []) || []
    );
  }, [metric]);

  const { data: datasource, execute } = useRequest<MetricsResponse[]>({
    url: `/api/metrics/${application.id}/datasource`,
    params: {
      fields: seriesFields,
      from: ranges[0],
      to: ranges[1]
    }
  });

  if (!datasource) {
    return <MetricLoading />;
  }

  const options = {
    ...commonOptions({
      unit: metric.unit as METRIC_UNIT,
      xAxisInterval: 50
    }),
    grid: {
      containLabel: true,
      right: 20,
      left: 10,
      bottom: 10,
      top: 10
    },
    series: buildSeries(metric.series, metric, "card"),
    dataset: {
      source: buildDatasource(datasource, metric.series)
    }
  };

  return (
    <ConditionalWrapper
      // isLoading={isLoading}
      isEmpty={datasource.length === 0}
      emptyView={<DataNotFound className="text-2xs" label="Data not found" />}
    >
      <ReactECharts
        style={{
          height: "150px"
        }}
        option={options}
      />
    </ConditionalWrapper>
  );
};

export default MetricPlot;

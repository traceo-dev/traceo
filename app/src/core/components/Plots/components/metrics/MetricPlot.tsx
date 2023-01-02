import { FC, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { IMetric, MetricsResponse, METRIC_UNIT } from "../../../../../types/metrics";
import { MetricLoading } from "../../../../../core/components/MetricLoading";
import { useApi } from "../../../../../core/lib/useApi";
import { StoreState } from "../../../../../types/store";
import { useSelector } from "react-redux";
import { EChartsOption } from "echarts";
import { ConditionalWrapper } from "../../../../../core/components/ConditionLayout";
import { buildDatasource, buildSeries, commonOptions } from "./utils";
import { DataNotFound } from "../../../../../core/components/DataNotFound";

interface Props {
  metric: IMetric;
  hrCount: number;
}
export const MetricPlot: FC<Props> = ({ metric, hrCount }) => {
  const { application } = useSelector((state: StoreState) => state.application);

  const seriesFields =
    metric?.series?.reduce<string[]>((acc, serie) => {
      acc.push(serie.field);

      return acc;
    }, []) || [];

  const {
    data: datasource,
    isLoading,
    execute
  } = useApi<MetricsResponse[]>({
    url: `/api/metrics/${application.id}/datasource`,
    params: {
      fields: seriesFields,
      hrCount
    }
  });

  useEffect(() => {
    execute();
  }, [hrCount, metric]);

  if (!datasource) {
    return <MetricLoading />;
  }

  const options: EChartsOption = {
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
      isLoading={isLoading}
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

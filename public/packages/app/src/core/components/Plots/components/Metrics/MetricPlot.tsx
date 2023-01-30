import { FC, lazy, useEffect } from "react";
import { IMetric, MetricsResponse, METRIC_UNIT } from "../../../../../types/metrics";
import { MetricLoading } from "../../../MetricLoading";
import { useRequest } from "../../../../hooks/useRequest";
import { StoreState } from "../../../../../types/store";
import { useSelector } from "react-redux";
import { ConditionalWrapper } from "../../../ConditionLayout";
import { buildDatasource, buildSeries, commonOptions } from "./utils";
import { DataNotFound } from "../../../DataNotFound";
import { useApplication } from "../../../../hooks/useApplication";

interface Props {
  metric: IMetric;
  hrCount: number;
}
const ReactECharts = lazy(() => import("echarts-for-react"));
const MetricPlot: FC<Props> = ({ metric, hrCount }) => {
  const { application } = useApplication();

  useEffect(() => {
    execute();
  }, [hrCount, metric]);

  const seriesFields =
    metric?.series?.reduce<string[]>((acc, serie) => {
      acc.push(serie.field);

      return acc;
    }, []) || [];

  const {
    data: datasource,
    // isLoading,
    execute
  } = useRequest<MetricsResponse[]>({
    url: `/api/metrics/${application.id}/datasource`,
    params: {
      fields: seriesFields,
      hrCount
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

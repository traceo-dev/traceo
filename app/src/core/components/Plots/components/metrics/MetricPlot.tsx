import { FC, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { IMetric, MetricsResponse } from "../../../../../types/metrics";
import { MetricLoading } from "../../../../../core/components/MetricLoading";
import { useApi } from "core/lib/useApi";
import { StoreState } from "types/store";
import { useSelector } from "react-redux";
import { EChartsOption, SeriesOption } from "echarts";
import { ConditionalWrapper } from "core/components/ConditionLayout";
import { commonOptions } from "./utils";
import { METRIC_UNIT } from "types/tsdb";
import { DataNotFound } from "core/components/DataNotFound";

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

  const { data, isLoading, execute } = useApi<MetricsResponse[]>({
    url: `/api/metrics/${application.id}/datasource`,
    params: {
      fields: seriesFields,
      hrCount
    }
  });

  useEffect(() => {
    execute();
  }, [hrCount, metric]);

  if (!data) {
    return <MetricLoading />;
  }

  const buildSeries = () =>
    metric.series?.map((serie) => ({
      type: serie.config.type,
      name: serie.name,
      showSymbol: false,
      color: serie.config.color,
      lineStyle: {
        color: serie.config.color,
        width: 1
      },
      areaStyle: {
        color: serie.config.color,
        opacity: 0.4
      }
    }));

  const buildSources = () => {
    const commonSource = {
      time: data?.map((t) => t._time)
    };

    metric.series?.map(({ field }) =>
      Object.assign(commonSource, {
        [field]: data?.map((m) => m[field])
      })
    );

    return commonSource;
  };

  const options: EChartsOption = {
    ...commonOptions({ unit: metric.unit as METRIC_UNIT }),
    grid: {
      containLabel: true,
      right: 10,
      left: 10,
      bottom: 10,
      top: 10
    },
    series: buildSeries() as SeriesOption[],
    dataset: {
      source: buildSources()
    }
  };

  return (
    <ConditionalWrapper
      isLoading={isLoading}
      isEmpty={data.length === 0}
      emptyView={<DataNotFound label="Metrics not found" />}
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

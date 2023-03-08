import { useApplication } from "../../../hooks/useApplication";
import { useRequest } from "../../../hooks/useRequest";
import { ConditionalWrapper } from "../../ConditionLayout";
import { DataNotFound } from "../../DataNotFound";
import { buildDatasource, buildSeries } from "./utils";
import { IMetric, MetricsResponse } from "@traceo/types";
import { FC, useEffect } from "react";
import { BaseChart } from "../BaseChart";
import { BaseXAxis } from "../BaseXAxis";
import dayjs from "dayjs";
import { BaseYAxis } from "../BaseYAxis";

interface Props {
  metric: IMetric;
  ranges: [number, number];
}
const MetricChart: FC<Props> = ({ metric, ranges }) => {
  const { application } = useApplication();

  const seriesFields =
    metric?.series?.reduce<string[]>((acc, serie) => {
      acc.push(serie.field);

      return acc;
    }, []) || [];

  const {
    data: datasource,
    execute,
    isLoading
  } = useRequest<MetricsResponse[]>({
    url: `/api/metrics/${application?.id}/datasource`,
    params: {
      fields: seriesFields,
      from: ranges[0],
      to: ranges[1]
    }
  });

  useEffect(() => {
    execute();
  }, [ranges, metric]);

  return (
    <ConditionalWrapper
      isLoading={isLoading}
      isEmpty={datasource?.length === 0 || !datasource}
      emptyView={<DataNotFound className="text-2xs" label="Data not found" />}
    >
      <BaseChart
        height="150px"
        renderer="canvas"
        xAxis={BaseXAxis({
          offset: 12,
          axisLabel: {
            formatter: (v: string) => dayjs(v).format("HH:mm"),
            fontSize: 11,
            // interval: 50,
            showMaxLabel: true
          },
          pointerFormatter: (v: unknown) => dayjs(Number(v)).format("HH:mm, DD MMM")
        })}
        yAxis={BaseYAxis({
          axisLabel: {
            formatter: `{value} ${metric.unit}`
          },
          minInterval: 1
        })}
        dataZoom={{
          type: "inside",
          xAxisIndex: [0],
          zoomOnMouseWheel: false,
          zoomLock: true,
          throttle: 50
        }}
        grid={{
          containLabel: true,
          right: 20,
          left: 10,
          bottom: 15,
          top: 10
        }}
        series={buildSeries(metric.series, metric, "card")}
        dataset={{
          source: buildDatasource(datasource, metric.series)
        }}
      />
    </ConditionalWrapper>
  );
};

export default MetricChart;

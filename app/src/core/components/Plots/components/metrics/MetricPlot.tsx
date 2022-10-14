import { LoadingOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import dayjs from "dayjs";
import { EChartsOption } from "echarts";
import { FC } from "react";
import { MetricsResponse, METRIC_UNIT } from "types/tsdb";
import { tooltipOptions, splitLine } from "../../utils";
import ReactECharts from "echarts-for-react";
import { METRIC_TYPE } from "types/metrics";
import { metricConfig } from "./utils";

interface Props {
  metrics: MetricsResponse[];
  options?: EChartsOption;
  type: METRIC_TYPE;
}
export const MetricPlot: FC<Props> = ({ metrics, options, type }) => {
  const { color, unit, field } = metricConfig[type];

  if (!metrics) {
    return (
      <Space direction="vertical" className="w-full items-center text-xs pb-5">
        <Typography.Text>Please wait. It can take a while...</Typography.Text>
        <LoadingOutlined />
      </Space>
    );
  }

  const chartOptions: EChartsOption = Object.assign(
    {
      dataset: {
        source: {
          time: metrics.map((t) => t._time),
          value: metrics.map((m) => m[field])
        }
      },
      legend: {
        show: false
      },
      animation: false,
      tooltip: {
        ...tooltipOptions,
        valueFormatter: (v: string) => `${v}${unit}`
      },
      grid: {
        left: 10,
        top: 10,
        right: 10,
        bottom: 15,
        containLabel: true
      },
      xAxis: {
        type: "category",
        offset: 12,
        axisLabel: {
          formatter: (v: string) => dayjs(v).format("HH:mm"),
          color: "white",
          fontSize: 11,
          interval: 15,
          showMaxLabel: true
        },
        axisPointer: {
          label: {
            formatter: (v: { value: string }) => dayjs(v.value).format("HH:mm, DD MMM")
          }
        },
        splitLine
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "white",
          fontSize: 11,
          formatter: `{value}${unit}`
        },
        splitLine
      },
      series: [
        {
          type: "line",
          name: type,
          showSymbol: false,
          color,
          lineStyle: {
            color,
            width: 1
          },
          areaStyle: {
            color,
            opacity: 0.4
          }
        }
      ]
    },
    options
  );

  return <ReactECharts option={chartOptions} />;
};

import { Space, Typography } from "antd";
import { FC } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import { splitLine, tooltipOptions } from "core/components/Plots/utils";
import { MetricsResponse } from "types/tsdb";
import dayjs from "dayjs";
import { LoadingOutlined } from "@ant-design/icons";

interface Props {
  metrics: MetricsResponse[];
  isLoading: boolean;
  options?: EChartsOption;
}
export const CpuUsagePlotMetrics: FC<Props> = ({ metrics, isLoading, options }) => {
  if (!metrics || isLoading) {
    return (
      <Space direction="vertical" className="w-full justify-center text-xs pb-5">
        <Typography.Text>Please wait. It can take a while...</Typography.Text>
        <LoadingOutlined />
      </Space>
    );
  }

  const chartOptions: EChartsOption = Object.assign(
    {
      dataset: {
        source: metrics
      },
      legend: {
        bottom: 10,
        left: "center",
        icon: "rect",
        textStyle: {
          color: "white"
        }
      },
      animation: false,
      tooltip: {
        ...tooltipOptions,
        valueFormatter: (v) => `${v}%`
      },
      grid: {
        left: "24px",
        right: "24px",
        top: "32px",
        containLabel: true
      },
      xAxis: {
        type: "category",
        offset: 12,
        axisLabel: {
          formatter: (v) => dayjs(v).format("HH:mm"),
          color: "white",
          fontSize: 11,
          interval: 15,
          showMaxLabel: true,
          showMinLabel: true
        },
        axisPointer: {
          label: {
            formatter: (v) => dayjs(v.value).format("HH:mm, DD MMM")
          }
        },
        splitLine
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "white",
          fontSize: 11,
          formatter: (v) => `${v}%`
        },
        splitLine
      },
      series: [
        {
          type: "line",
          smooth: true,
          name: "cpu",
          showSymbol: false,
          color: "#0991b3",
          lineStyle: {
            color: "#0991b3",
            width: 1
          },
          areaStyle: {
            color: "#0991b3",
            opacity: 0.4
          }
        }
      ]
    },
    options
  );
  return (
    <>
      <ReactECharts option={chartOptions} />
    </>
  );
};

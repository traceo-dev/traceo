import { LoadingOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { FC, useEffect } from "react";
import { splitLine } from "../utils";
import { useApi } from "../../../lib/useApi";
import { statistics } from "../../../utils/statistics";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

interface Props {
  id: string;
}
export const IncidentsAppListPlot: FC<Props> = ({ id }) => {
  const chartsEnv = localStorage.getItem("chartsEnv");

  const {
    data: stats = [],
    isLoading,
    execute
  } = useApi<
    {
      date: number;
      count: number;
    }[]
  >({
    url: "/api/statistics/total",
    params: {
      id
    }
  });

  useEffect(() => {
    execute();
  }, [id, chartsEnv]);

  if (!stats || isLoading) {
    return (
      <Space className="w-full justify-center">
        <LoadingOutlined />
      </Space>
    );
  }

  const data = () => {
    if (stats.length > 0) {
      return stats;
    }

    const data = statistics.mockData();
    return data;
  };

  const options: EChartsOption = {
    dataset: {
      source: data()
    },
    animation: false,
    tooltip: {
      show: false
    },
    grid: {
      left: "5px",
      right: "5px",
      top: "10px",
      bottom: "5px",
      containLabel: true
    },
    xAxis: {
      show: false,
      splitLine,
      type: "category"
    },
    yAxis: {
      splitLine,
      min: 0,
      max: (e) => {
        return e.max;
      },
      interval: 99999
    },
    series: {
      type: "bar",
      color: "#23C46A",
      itemStyle: {
        borderColor: "#23C46A",
        opacity: 0.6,
        borderWidth: 2
      }
    }
  };
  return (
    <>
      <ReactECharts option={options} />
      <style>{`
      .echarts-for-react {
        height: 120px !important;
      }
    `}</style>
    </>
  );
};

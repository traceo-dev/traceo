import { LoadingOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { FC, useEffect } from "react";
import { splitLine, tooltipOptions } from "../utils";
import { useApi } from "../../../lib/useApi";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import dateUtils from "../../../../core/utils/date";

interface Props {
  id: string;
}
export const IncidentsAppListPlot: FC<Props> = ({ id }) => {
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
  }, [id]);

  if (!stats || isLoading) {
    return (
      <Space className="w-full justify-center">
        <LoadingOutlined />
      </Space>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  const options: EChartsOption = {
    dataset: {
      source: stats
    },
    animation: false,
    tooltip: {
      ...tooltipOptions,
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "45px",
      right: "5px",
      top: "10px",
      bottom: "5px"
    },
    xAxis: {
      show: false,
      splitLine,
      type: "category",
      axisPointer: {
        label: {
          formatter: (v) => dateUtils.formatDate(v.value as number, "MMM D, YYYY")
        }
      }
    },
    yAxis: {
      splitLine,
      axisLabel: {
        showMinLabel: false,
        hideOverlap: true
      },
      alignTicks: true,
      min: 0,
      max: (e) => {
        return e.max;
      },
      interval: 99999
    },
    series: {
      name: "Incidents",
      type: "bar",
      color: "#04785A",
      itemStyle: {
        borderColor: "#04785A",
        borderWidth: 2
      },
      barWidth: 10,
      barGap: "5%"
    }
  };
  return (
    <>
      <ReactECharts option={options} />
      <style>{`
      .echarts-for-react {
        height: 40px !important;
        width: 320px !important;
      }
    `}</style>
    </>
  );
};

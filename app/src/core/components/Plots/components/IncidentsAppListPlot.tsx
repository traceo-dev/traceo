import { LoadingOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { FC, useEffect } from "react";
import { splitLine, tooltipOptions } from "../utils";
import { useApi } from "../../../lib/useApi";
import ReactECharts from "echarts-for-react";
import { EChartsOption, graphic } from "echarts";
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
    tooltip: tooltipOptions,
    grid: {
      left: "5px",
      right: "5px",
      top: "5px",
      bottom: "5px",
      containLabel: false
    },
    xAxis: {
      show: false,
      splitLine,
      type: "category",
      axisLabel: {
        formatter: (v) => dateUtils.formatDate(Number(v), "DD-MM"),
        color: "white",
        fontSize: 11
      },
      axisPointer: {
        label: {
          formatter: (v) => dateUtils.formatDate(v.value as number, "MMM D, YYYY")
        }
      }
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
      type: "line",
      name: "Incidents",
      color: "#E24D42",
      showSymbol: false,
      itemStyle: {
        borderColor: "#E24D42",
        opacity: 0.6,
        borderWidth: 2
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#641D2C"
          },
          {
            offset: 1,
            color: "#6B403A"
          }
        ])
      }
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

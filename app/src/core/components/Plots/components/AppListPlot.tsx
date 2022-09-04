import { LoadingOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { FC, useEffect } from "react";
import { UPlot } from "src/core/components/Plots/UPlot";
import { DrawStyle, normalizePlotData } from "src/core/components/Plots/utils";
import { useApi } from "src/core/lib/useApi";
import { statistics } from "src/core/utils/statistics";
import { UPlotConfig } from "src/types/plot";

interface Props {
  id: string;
}
export const AppListPlot: FC<Props> = ({ id }) => {
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

  const width = window.innerWidth / 4;
  const currentChartType = DrawStyle.BARS;

  const handleChartType: Record<number, DrawStyle> = {
    0: DrawStyle.LINE,
    1: DrawStyle.BARS
  };

  const plotConfig: UPlotConfig = {
    series: [
      {
        label: ""
      },
      {
        points: { show: false },
        stroke: "#23C46A",
        width: 2,
        alpha: 0.6,
        fill: "#23C46A"
      }
    ],
    plugins: [],
    axes: [
      {
        show: false
      }
    ],
    tooltip: {
      hidden: true
    },
    width,
    height: 80,
    drawStyle: handleChartType[currentChartType]
  };

  const data = () => {
    if (stats.length > 0) {
      return stats;
    }

    const data = statistics.mockData();
    return data;
  };

  return <UPlot data={normalizePlotData(data())} config={plotConfig} />;
};

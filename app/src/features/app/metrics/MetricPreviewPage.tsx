import { Button, Segmented, Space, Switch, Table, Typography } from "antd";
import { PagePanel } from "core/components/PagePanel";
import { CpuUsagePlotMetrics } from "core/components/Plots/components/CpuUsagePlotMetric";
import { useApi } from "core/lib/useApi";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { StoreState } from "types/store";
import { MetricsResponse } from "types/tsdb";
import { EChartsOption } from "echarts";
import { AppMetricsPreviewNavigationPage } from "./components/AppMetricsPreviewNavigationPage";
import { SyncOutlined } from "@ant-design/icons";
import { toolboxOptions } from "core/components/Plots/utils";

type CHART_TYPE = "bar" | "line" | "scatter";

export const MetricPreviewPage = () => {
  const { id } = useParams();
  const [isFormattedTime, setFormattedTime] = useState<boolean>(true);

  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  const [hrCount, setHrCount] = useState<number>(1);
  const [chartType, setChartType] = useState<CHART_TYPE>("line");
  const [isChartArea, setChartArea] = useState<boolean>(true);

  const {
    data: metrics = [],
    isLoading,
    execute
  } = useApi<MetricsResponse[]>({
    url: "/api/datasource/metrics",
    params: { id, hrCount }
  });

  useEffect(() => {
    execute();
  }, [hrCount]);

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      render: (time: string) =>
        isFormattedTime ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : time
    },
    {
      title: "Cpu",
      dataIndex: "cpuUsage",
      render: (cpu: number) => `${cpu}%`
    }
  ];

  const chartOptions: EChartsOption = {
    toolbox: toolboxOptions,
    legend: {
      bottom: 10,
      right: 25,
      icon: "rect",
      textStyle: {
        color: "white"
      }
    },
    series: [
      {
        type: chartType,
        smooth: false,
        name: "cpu",
        color: "#0991b3",
        showSymbol: true,
        symbol: "circle",
        symbolSize: 5,
        lineStyle: {
          width: 1
        },
        areaStyle: {
          color: isChartArea ? "#0991b3" : "transparent",
          opacity: 0.4
        }
      }
    ]
  };

  return (
    <AppMetricsPreviewNavigationPage>
      <PagePanel className="py-3 px-5">
        <Space className="w-full justify-between mb-12">
          <Typography.Text className="font-semibold">Graph</Typography.Text>
          <Space>
            {chartType === "line" && (
              <Space>
                <Typography.Text className="text-md">Area</Typography.Text>
                <Switch
                  className="mr-5"
                  defaultChecked={isChartArea}
                  onClick={() => setChartArea(!isChartArea)}
                />
              </Space>
            )}

            <Segmented
              className="mr-5"
              options={[
                { value: "line", label: "Line" },
                { value: "bar", label: "Bars" },
                { value: "scatter", label: "Points" }
              ]}
              onChange={(v) => setChartType(v as CHART_TYPE)}
            />
            <Segmented
              defaultValue={hrCount}
              options={[
                { value: 1, label: "1h" },
                { value: 3, label: "3h" },
                { value: 6, label: "6h" },
                { value: 12, label: "12h" },
                { value: 24, label: "24h" }
              ]}
              onChange={(v) => setHrCount(v as number)}
            />
            <Button type="primary" onClick={() => execute()}>
              Refresh <SyncOutlined />
            </Button>
          </Space>
        </Space>
        <CpuUsagePlotMetrics
          metrics={metrics}
          isLoading={isLoading}
          options={chartOptions}
        />
      </PagePanel>
      <PagePanel className="py-3 px-5">
        <Space className="w-full justify-between" direction="vertical">
          <Space className="w-full justify-between mb-12">
            <Typography.Text className="font-semibold">Raw data</Typography.Text>
            <Space>
              <Typography.Text className="text-md">Formatted time</Typography.Text>
              <Switch
                defaultChecked={isFormattedTime}
                onClick={() => setFormattedTime(!isFormattedTime)}
              />
            </Space>
          </Space>
          <Table
            dataSource={metrics}
            columns={columns}
            pagination={{ pageSize: 150 }}
            scroll={{ y: 440 }}
          />
        </Space>
      </PagePanel>
    </AppMetricsPreviewNavigationPage>
  );
};

export default MetricPreviewPage;

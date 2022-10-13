import { CpuUsagePlotMetrics } from "core/components/Plots/components/CpuUsagePlotMetric";
import { useApi } from "core/lib/useApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MetricsResponse } from "types/tsdb";
import { EChartsOption } from "echarts";
import { AppMetricsPreviewNavigationPage } from "./components/AppMetricsPreviewNavigationPage";
import { toolboxOptions } from "core/components/Plots/utils";
import { MetricPlotWrapper } from "./components/MetricPlotWrapper";
import { CHART_TYPE, METRIC_TYPE } from "types/metrics";
import { MetricTableWrapper } from "./components/MetricTableWrapper";

export const MetricPreviewPage = () => {
  const { id } = useParams();

  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  const [hrCount, setHrCount] = useState<number>(1);
  const [chartType, setChartType] = useState<CHART_TYPE>("line");

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

  const chartOptions: EChartsOption = {
    toolbox: toolboxOptions,
    grid: {
      left: 12,
      right: 12,
      bottom: 50,
      containLabel: true
    },
    series: [
      {
        type: chartType,
        smooth: false,
        name: "cpu",
        color: "#0991b3",
        showSymbol: chartType !== "line",
        symbol: "circle",
        symbolSize: 5,
        lineStyle: {
          width: 1
        },
        areaStyle: {
          color: "#0991b3",
          opacity: 0.4
        }
      }
    ]
  };

  const MetricPlot = () => {
    switch (type) {
      case METRIC_TYPE.CPU: {
        return (
          <CpuUsagePlotMetrics
            metrics={metrics}
            isLoading={isLoading}
            options={chartOptions}
          />
        );
      }
    }
  };

  const metricTableColumnsValue = () => {
    switch (type) {
      case METRIC_TYPE.CPU: {
        return [
          {
            title: "Cpu",
            dataIndex: "cpuUsage",
            render: (cpu: number) => `${cpu}%`
          }
        ];
      }
    }
  };

  return (
    <AppMetricsPreviewNavigationPage>
      <MetricPlotWrapper
        execute={execute}
        hrCount={hrCount}
        setHrCount={setHrCount}
        setChartType={setChartType}
        isLoading={isLoading}
        metrics={metrics}
      >
        <MetricPlot />
      </MetricPlotWrapper>
      <MetricTableWrapper metrics={metrics} columns={metricTableColumnsValue()} />
    </AppMetricsPreviewNavigationPage>
  );
};

export default MetricPreviewPage;

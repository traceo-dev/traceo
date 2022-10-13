import { CpuUsagePlotMetrics } from "core/components/Plots/components/metrics/CpuUsagePlotMetric";
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
import { MemoryUsagePlotMetrics } from "core/components/Plots/components/metrics/MemoryUsagePlotMetric";

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

  const handleMetricColor: Record<METRIC_TYPE, string> = {
    [METRIC_TYPE.CPU]: "#0991b3",
    [METRIC_TYPE.MEMORY]: "#DE4457"
  };

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
        color: handleMetricColor[type],
        showSymbol: chartType !== "line",
        symbol: "circle",
        symbolSize: 5,
        lineStyle: {
          width: 1
        },
        areaStyle: {
          color: handleMetricColor[type],
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
      case METRIC_TYPE.MEMORY: {
        return (
          <MemoryUsagePlotMetrics
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
      case METRIC_TYPE.MEMORY: {
        return [
          {
            title: "Memory",
            dataIndex: "memoryUsage",
            render: (mem: number) => `${mem}%`
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

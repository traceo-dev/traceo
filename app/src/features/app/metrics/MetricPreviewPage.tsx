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
import { metricConfig } from "core/components/Plots/components/metrics/utils";
import { MetricPlot } from "core/components/Plots/components/metrics/MetricPlot";

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

  const config = metricConfig[type];

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
        name: config.type,
        color: config.color,
        showSymbol: chartType !== "line",
        symbol: "circle",
        symbolSize: 5,
        lineStyle: {
          width: 1
        },
        areaStyle: {
          color: config.color,
          opacity: 0.4
        }
      }
    ]
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
        <MetricPlot metrics={metrics} options={chartOptions} {...config} />
      </MetricPlotWrapper>
      <MetricTableWrapper type={type as METRIC_TYPE} metrics={metrics} />
    </AppMetricsPreviewNavigationPage>
  );
};

export default MetricPreviewPage;

import { useApi } from "../../../core/lib/useApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MetricsResponse } from "../../../types/tsdb";
import { AppMetricsPreviewNavigationPage } from "./components/AppMetricsPreviewNavigationPage";
import { MetricPlotWrapper } from "./components/MetricPlotWrapper";
import { CHART_TYPE, METRIC_TYPE } from "../../../types/metrics";
import { MetricTableWrapper } from "./components/MetricTableWrapper";
import { MetricPlot } from "../../../core/components/Plots/components/Metrics/MetricPlot";

export const MetricPreviewPage = () => {
  const { id } = useParams();

  const query = new URLSearchParams(location.search);
  const type = query.get("type") as METRIC_TYPE;

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
        <MetricPlot type={type} metrics={metrics} plotType={chartType} />
      </MetricPlotWrapper>
      <MetricTableWrapper type={type} metrics={metrics} />
    </AppMetricsPreviewNavigationPage>
  );
};

export default MetricPreviewPage;

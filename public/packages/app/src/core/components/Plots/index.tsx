import { LoadingOutlined } from "@ant-design/icons";
import { lazy, Suspense } from "react";
import styled from "styled-components";

const LazyIncidentsAppListPlot = lazy(() => import("./components/IncidentsAppListPlot"));
const LazyIncidentsTodayPlot = lazy(() => import("./components/IncidentsTodayPlot"));
const LazyAppOverviewPlot = lazy(() => import("./components/IncidentsOverviewPlot"));
const LazyIncidentListPlot = lazy(() => import("./components/IncidentsListPlot"));
const LazyLogPlot = lazy(() => import("./components/Logs/LogsExplorePlot"));
const LazyMetricPlot = lazy(() => import("./components/Metrics/MetricPlot"));
const LazyMetricPreviewPlot = lazy(
  () => import("./components/Metrics/MetricPreviewPlot")
);

const FallbackWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const Fallback = () => (
  <FallbackWrapper>
    <LoadingOutlined />
  </FallbackWrapper>
);

export const SmallAppIncidentsPlot = ({ id }) => {
  return (
    <Suspense fallback={<LoadingOutlined />}>
      <LazyIncidentsAppListPlot id={id} />
    </Suspense>
  );
};

export const AppIncidentsTodayPlot = ({ stats }) => {
  return (
    <Suspense fallback={<Fallback />}>
      <LazyIncidentsTodayPlot stats={stats} />
    </Suspense>
  );
};

export const AppOverviewPlot = ({ stats }) => {
  return (
    <Suspense fallback={<Fallback />}>
      <LazyAppOverviewPlot stats={stats} />
    </Suspense>
  );
};

export const AppIncidentsListPlot = ({ errors }) => {
  return (
    <Suspense fallback={<LoadingOutlined />}>
      <LazyIncidentListPlot errors={errors} />
    </Suspense>
  );
};

export const LogsPlot = ({ logs }) => {
  return (
    <Suspense fallback={<Fallback />}>
      <LazyLogPlot logs={logs} />
    </Suspense>
  );
};

export const MetricCardPlot = ({ metric, hrCount }) => {
  return (
    <Suspense fallback={<Fallback />}>
      <LazyMetricPlot metric={metric} hrCount={hrCount} />
    </Suspense>
  );
};

export const MetricPreviewPlot = ({ isExpandMode, options }) => {
  return (
    <Suspense fallback={<Fallback />}>
      <LazyMetricPreviewPlot isExpandMode={isExpandMode} options={options} />
    </Suspense>
  );
};

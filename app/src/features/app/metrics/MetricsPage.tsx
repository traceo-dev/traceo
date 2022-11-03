import { Card, Col, Row, Typography } from "antd";
import { PagePanel } from "../../../core/components/PagePanel";
import { useApi } from "../../../core/lib/useApi";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { StoreState } from "../../../types/store";
import { CONNECTION_STATUS, MetricsResponse } from "../../../types/tsdb";
import AppMetricsNavigationPage from "./components/AppMetricsNavigationPage";
import { ConnectionError } from "./components/ConnectionError";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { MetricsHeader } from "./components/MetricsHeader";
import { METRIC_TYPE } from "../../../types/metrics";
import { slugifyForUrl } from "../../../core/utils/stringUtils";
import { EChartsOption } from "echarts";
import { MetricPlot } from "../../../core/components/Plots/components/metrics/MetricPlot";
import {
  metricConfig,
  MetricSeriesOption
} from "../../../core/components/Plots/components/metrics/utils";

const MetricsPage = () => {
  const { id } = useParams();
  const { application } = useSelector((state: StoreState) => state.application);

  const navigate = useNavigate();

  const [hrCount, setHrCount] = useState<number>(1);

  const isConnectedTSDB = !!application?.connectedTSDB;

  const isConnectedSuccessfully =
    application?.influxDS?.connStatus === CONNECTION_STATUS.CONNECTED;

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

  const showMetricPreview = (type: METRIC_TYPE) =>
    navigate(
      `/app/${application.id}/${slugifyForUrl(
        application.name
      )}/metrics/preview?type=${type}`
    );

  const options: EChartsOption = {
    grid: {
      containLabel: true,
      right: 10,
      left: 10,
      bottom: 10,
      top: 10,
      height: 150
    }
  };

  const avg = (options: MetricSeriesOption[]) => {
    if (!metrics) return;

    //average value calculated only for single series charts
    if (!options || options.length > 1) {
      return null;
    }

    const field = options[0].field;

    return (
      metrics?.reduce((acc, val) => (acc += val[field]), 0) / metrics?.length || null
    );
  };

  if (!isConnectedTSDB) {
    return (
      <AppMetricsNavigationPage>
        <PagePanel>
          <NotConnectedTSDB />
        </PagePanel>
      </AppMetricsNavigationPage>
    );
  }

  if (!isConnectedSuccessfully) {
    return (
      <AppMetricsNavigationPage>
        <PagePanel>
          <ConnectionError />
        </PagePanel>
      </AppMetricsNavigationPage>
    );
  }

  return (
    <>
      <AppMetricsNavigationPage>
        <MetricsHeader
          loading={isLoading}
          hrCount={hrCount}
          setHrCount={setHrCount}
          execute={execute}
        />
        <Row className="pt-3" gutter={[12, 24]}>
          {Object.values(METRIC_TYPE).map((type, index) => (
            <Col span={12} key={index}>
              <MetricCard
                type={type}
                avg={avg(metricConfig[type].series)}
                onExplore={() => showMetricPreview(type)}
              >
                <MetricPlot
                  type={type}
                  metrics={metrics}
                  options={options}
                  plotType="line"
                />
              </MetricCard>
            </Col>
          ))}
        </Row>
      </AppMetricsNavigationPage>
    </>
  );
};

interface MetricCardProps {
  type: METRIC_TYPE;
  children: JSX.Element;
  onExplore?: () => void;
  avg?: number;
}
const MetricCard: FC<MetricCardProps> = ({ children, onExplore, avg, type }) => {
  const { unit, title } = metricConfig[type];
  return (
    <>
      <Card
        extra={
          avg && (
            <span className="text-amber-500 font-semibold">
              {avg.toFixed(2)}
              {unit}
            </span>
          )
        }
        onClick={onExplore}
        title={<Typography.Text className="font-normal text-md">{title}</Typography.Text>}
        className="metric-panel"
      >
        {children}
      </Card>
      <style>{`
        .metric-panel {
          cursor: pointer;
          background-color: var(--color-bg-primary);
          border: 1px solid rgba(204, 204, 220, 0.07);
          box-shadow: rgb(24 26 27 / 75%) 0px 1px 2px;
          min-width: 100%;
        }

        .echarts-for-react {
          height: 170px !important;
        }
      `}</style>
    </>
  );
};

export default MetricsPage;

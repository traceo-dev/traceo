import { EyeOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import { PagePanel } from "core/components/PagePanel";
import { useApi } from "core/lib/useApi";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { StoreState } from "types/store";
import { CONNECTION_STATUS, MetricsResponse } from "types/tsdb";
import AppMetricsNavigationPage from "./components/AppMetricsNavigationPage";
import { ConnectionError } from "./components/ConnectionError";
import { CpuUsagePlotMetrics } from "../../../core/components/Plots/components/CpuUsagePlotMetric";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { MetricsHeader } from "./components/MetricsHeader";
import { METRIC_TYPE } from "types/metrics";
import { slugifyForUrl } from "core/utils/stringUtils";

const MetricsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.application);

  const [hrCount, setHrCount] = useState<number>(1);

  const isConnectedTSDB = !!application.connectedTSDB;

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

  return (
    <>
      <AppMetricsNavigationPage>
        {!isConnectedTSDB ? (
          <NotConnectedTSDB />
        ) : (
          <>
            {application.influxDS.connStatus === CONNECTION_STATUS.CONNECTED ? (
              <>
                <MetricsHeader
                  loading={isLoading}
                  hrCount={hrCount}
                  setHrCount={setHrCount}
                />
                <Row className="pt-3" gutter={[12, 24]}>
                  <Col span={12}>
                    <MetricCard
                      title="CPU Usage"
                      onExplore={() => showMetricPreview(METRIC_TYPE.CPU)}
                    >
                      <CpuUsagePlotMetrics metrics={metrics} isLoading={isLoading} />
                    </MetricCard>
                  </Col>
                </Row>
              </>
            ) : (
              <PagePanel>
                <ConnectionError />
              </PagePanel>
            )}
          </>
        )}
      </AppMetricsNavigationPage>
    </>
  );
};

interface MetricCardProps {
  title: string;
  children: any;
  onExplore?: () => void;
}
const MetricCard: FC<MetricCardProps> = ({ title, children, onExplore }) => {
  return (
    <>
      <Card
        extra={<EyeOutlined onClick={onExplore} />}
        title={title}
        className="metric-panel"
      >
        {children}
      </Card>
      <style>{`
        .metric-panel {
          background-color: var(--color-bg-primary);
          border: 1px solid rgba(204, 204, 220, 0.07);
          border-radius: 8px;
          box-shadow: rgb(24 26 27 / 75%) 0px 1px 2px;
          padding-bottom: 0px;
          min-width: 100%;
        }

        .metric-panel > .ant-card-head {
          text-align: center;
        }
      `}</style>
    </>
  );
};

export default MetricsPage;

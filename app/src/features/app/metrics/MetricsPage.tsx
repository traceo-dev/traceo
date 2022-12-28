import { Card, Col, Row, Typography } from "antd";
import { PagePanel } from "../../../core/components/PagePanel";
import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { CONNECTION_STATUS } from "../../../types/tsdb";
import AppMetricsNavigationPage from "./components/AppMetricsNavigationPage";
import { ConnectionError } from "./components/ConnectionError";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { IMetric } from "../../../types/metrics";
import { MetricPlot } from "../../../core/components/Plots/components/Metrics/MetricPlot";
import { ConditionalWrapper } from "core/components/ConditionLayout";
import { dispatch } from "store/store";
import { loadMetrics } from "./state/actions";

const MetricsPage = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const { metrics, hasFetched } = useSelector((state: StoreState) => state.metrics);

  useEffect(() => {
    dispatch(loadMetrics());
  }, [application]);

  const isConnectedTSDB = !!application?.connectedTSDB;

  const isConnectedSuccessfully =
    application?.influxDS?.connStatus === CONNECTION_STATUS.CONNECTED;

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
        {/* <MetricsHeader
          loading={isLoading}
          hrCount={hrCount}
          setHrCount={setHrCount}
          execute={() => console.log()}
        /> */}
        <ConditionalWrapper isLoading={!hasFetched}>
          <Row className="pt-3" gutter={[12, 24]}>
            {metrics?.map((metric, index) => (
              <Col span={12} key={index}>
                <MetricCard metric={metric} />
              </Col>
            ))}
          </Row>
        </ConditionalWrapper>
      </AppMetricsNavigationPage>
    </>
  );
};

interface MetricCardProps {
  metric: IMetric;
}
const MetricCard: FC<MetricCardProps> = ({ metric }) => {
  return (
    <>
      <Card
        title={
          <Typography.Text className="font-normal text-md">
            {metric?.name}
          </Typography.Text>
        }
        className="metric-panel"
      >
        <MetricPlot metric={metric} />
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

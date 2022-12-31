import { Button, Col, Row, Select, Space, Tooltip, Typography } from "antd";
import { PagePanel } from "../../../core/components/PagePanel";
import { FC, useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { CONNECTION_STATUS } from "../../../types/tsdb";
import AppMetricsNavigationPage from "./components/AppMetricsNavigationPage";
import { ConnectionError } from "./components/ConnectionError";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { IMetric, timeLimitOptions } from "../../../types/metrics";
import { MetricPlot } from "../../../core/components/Plots/components/Metrics/MetricPlot";
import { ConditionalWrapper } from "core/components/ConditionLayout";
import { dispatch } from "store/store";
import { loadMetrics } from "./state/actions";
import { useNavigate } from "react-router-dom";
import { slugifyForUrl } from "core/utils/stringUtils";
import {
  BarChartOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { getLocalStorageMetricHrCount } from "core/utils/localStorage";
import PageHeader from "core/components/PageHeader";

const MetricsPage = () => {
  // useCleanup((state: StoreState) => state.metrics);

  const [hrCount, setHrCount] = useState<number>(getLocalStorageMetricHrCount() || 12);

  const { application } = useSelector((state: StoreState) => state.application);
  const { metrics, hasFetched } = useSelector((state: StoreState) => state.metrics);

  useEffect(() => {
    reloadMetrics();
  }, [application]);

  const reloadMetrics = () => dispatch(loadMetrics());

  const isConnectedTSDB = !!application?.connectedTSDB;

  const isConnectedSuccessfully =
    application?.influxDS?.connStatus === CONNECTION_STATUS.CONNECTED;

  const renderContent = () => {
    if (!isConnectedTSDB) {
      return (
        <PagePanel>
          <NotConnectedTSDB />
        </PagePanel>
      );
    }

    if (!isConnectedSuccessfully) {
      return (
        <PagePanel>
          <ConnectionError />
        </PagePanel>
      );
    }

    return (
      <ConditionalWrapper isLoading={!hasFetched}>
        <Row className="mt-9 gap-0" gutter={[8, 24]}>
          {metrics?.map((metric, index) => (
            <Col span={8} key={index}>
              <MetricCard metric={metric} hrCount={hrCount} />
            </Col>
          ))}
        </Row>
      </ConditionalWrapper>
    );
  };

  return (
    <AppMetricsNavigationPage>
      <PageHeader
        icon={<BarChartOutlined />}
        title="Metrics"
        subTitle="View metrics from your app after connecting and configuring the SDK"
        extra={
          isConnectedTSDB &&
          isConnectedSuccessfully && (
            <>
              <Select
                className="bg-secondary"
                defaultValue={12}
                onChange={(v) => setHrCount(v)}
              >
                {timeLimitOptions.map(({ label, value }, index) => (
                  <Select.Option key={index} value={value}>
                    <ClockCircleOutlined />
                    <Typography.Text className="ml-2">{label}</Typography.Text>
                  </Select.Option>
                ))}
              </Select>
              <Button onClick={reloadMetrics} icon={<SyncOutlined />} type="primary">
                Refresh
              </Button>
            </>
          )
        }
      />
      {renderContent()}
    </AppMetricsNavigationPage>
  );
};

interface MetricCardProps {
  metric: IMetric;
  hrCount: number;
}
const MetricCard: FC<MetricCardProps> = ({ metric, hrCount }) => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.application);

  const onClick = () => {
    navigate(
      `/app/${application.id}/${slugifyForUrl(application.name)}/metrics/preview/${
        metric.id
      }?name=${slugifyForUrl(metric.name)}`
    );
  };

  return (
    <>
      <div className="p-2 metric-panel">
        <Space className="w-full" direction="vertical" onClick={onClick}>
          <Space className="w-full pb-2 pt-1 justify-center">
            <Typography.Text className="text-md">{metric?.name}</Typography.Text>
            {metric?.description && (
              <Tooltip title={metric?.description}>
                <QuestionCircleOutlined className="text-xs" />
              </Tooltip>
            )}
          </Space>

          <MetricPlot metric={metric} hrCount={hrCount} />
        </Space>
      </div>

      <style>{`
        .metric-panel {
          cursor: pointer;
          background-color: var(--color-bg-primary);
          border: 1px solid rgba(204, 204, 220, 0.07);
          border-radius: 3px;
          box-shadow: rgb(24 26 27 / 75%) 0px 1px 2px;
          min-width: 100%;
          height: 220px;
          margin-bottom: 7px;
        }
      `}</style>
    </>
  );
};

export default MetricsPage;

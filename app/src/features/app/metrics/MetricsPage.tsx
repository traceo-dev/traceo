import { QuestionCircleFilled } from "@ant-design/icons";
import { Col, Row, Space, Tooltip, Typography } from "antd";
import { PagePanel } from "core/components/PagePanel";
import { useApi } from "core/lib/useApi";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { StoreState } from "types/store";
import { CONNECTION_STATUS, MetricsResponse } from "types/tsdb";
import AppMetricsNavigationPage from "./components/AppMetricsNavigationPage";
import { ConnectionError } from "./components/ConnectionError";
import { CpuUsagePlotMetrics } from "../../../core/components/Plots/components/CpuUsagePlotMetric";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { MetricsHeader } from "./components/MetricsHeader";

const MetricsPage = () => {
  const { id } = useParams();
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

  return (
    <>
      <AppMetricsNavigationPage>
        {!isConnectedTSDB ? (
          <NotConnectedTSDB />
        ) : (
          <>
            {application.influxDS.connStatus === CONNECTION_STATUS.CONNECTED ? (
              <>
                <MetricsHeader hrCount={hrCount} setHrCount={setHrCount} />
                <Row className="pt-5" gutter={[12, 24]}>
                  <Col span={12}>
                    <MetricCard
                      title="CPU"
                      tooltip="CPU usage is the percentage of time that the CPU is being used to complete its tasks."
                      // extra={
                      //   <Typography.Text className="font-semibold">
                      //     8 CPU / ~16,4%
                      //   </Typography.Text>
                      // }
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
  tooltip?: string;
  children: any;
  extra?: any;
}
const MetricCard: FC<MetricCardProps> = ({ title, children, extra, tooltip }) => {
  return (
    <>
      <Space direction="vertical" className="metric-panel">
        <Space className="w-full justify-between pb-5">
          <Space>
            <Typography.Text className="text-xl font-semibold">{title}</Typography.Text>
            {tooltip && (
              <Tooltip placement="bottomRight" title={tooltip}>
                <QuestionCircleFilled className="text-xs cursor-pointer" />
              </Tooltip>
            )}
          </Space>
          {extra}
        </Space>
        {children}
      </Space>
      <style>{`
        .metric-panel {
          background-color: var(--color-bg-primary);
          border: 1px solid rgba(204, 204, 220, 0.07);
          border-radius: 8px;
          box-shadow: rgb(24 26 27 / 75%) 0px 1px 2px;
          padding: 24px;
          padding-bottom: 0px;
          min-width: 100%;
        }
      `}</style>
    </>
  );
};

export default MetricsPage;

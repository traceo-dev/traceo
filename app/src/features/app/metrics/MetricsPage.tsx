import { Button, Col, Row, Segmented, Select, Space, Tooltip, Typography } from "antd";
import { PagePanel } from "../../../core/components/PagePanel";
import { FC, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { slugifyForUrl } from "core/utils/stringUtils";
import { useCleanup } from "core/hooks/useCleanup";
import {
  BarChartOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { SearchWrapper } from "core/components/SearchWrapper";
import { SearchInput } from "core/components/SearchInput";
import { searchMetric } from "./utils/searchUtil";
import { DataNotFound } from "core/components/DataNotFound";

export const timeLimitOptions = [
  {
    value: 1,
    label: "Last 1 hour"
  },
  {
    value: 2,
    label: "last 2 hours"
  },
  {
    value: 3,
    label: "Last 3 hours"
  },
  {
    value: 6,
    label: "Last 6 hours"
  },
  {
    value: 12,
    label: "Last 12 hours"
  },
  {
    value: 24,
    label: "Last 24 hours"
  }
];

const MetricsPage = () => {
  useCleanup((state: StoreState) => state.metrics);

  const [search, setSearch] = useState<string>(null);
  const [hrCount, setHrCount] = useState<number>(12);

  const [filteredMetrics, setFilteredMetrics] = useState<IMetric[]>([]);

  const { application } = useSelector((state: StoreState) => state.application);
  const { metrics, hasFetched } = useSelector((state: StoreState) => state.metrics);

  useEffect(() => {
    dispatch(loadMetrics());
  }, [application]);

  useEffect(() => {
    setFilteredMetrics(metrics);
  }, [metrics]);

  useEffect(() => {
    if (search?.length === 0) {
      setFilteredMetrics(metrics);
    }
    setFilteredMetrics(searchMetric(search, metrics));
  }, [search]);

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
        <Row className="gap-0" gutter={[8, 24]}>
          {filteredMetrics?.map((metric, index) => (
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
      {isConnectedSuccessfully && isConnectedTSDB && (
        <PagePanel>
          <SearchWrapper>
            <SearchInput value={search} setValue={setSearch} />
            <Select defaultValue={12} onChange={(v) => setHrCount(v)}>
              {timeLimitOptions.map(({ label, value }, index) => (
                <Select.Option key={index} value={value}>
                  <ClockCircleOutlined className="mr-1" />
                  {label}
                </Select.Option>
              ))}
            </Select>
          </SearchWrapper>
          {filteredMetrics?.length === 0 && (
            <DataNotFound
              className="mt-12"
              label="Metrics not found!"
              explanation={search?.length > 0 && `No results for ${search}`}
            />
          )}
        </PagePanel>
      )}

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

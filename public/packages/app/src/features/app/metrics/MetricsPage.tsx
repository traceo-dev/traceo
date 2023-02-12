import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useAppDispatch } from "../../../store";
import { loadMetrics } from "./state/actions";
import { BarChartOutlined } from "@ant-design/icons";
import { MetricCard } from "./components/MetricCard";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { InputSearch, Card, Row, Col, Alert } from "@traceo/ui";
import { EmptyMetricsList } from "./components/EmptyMetricsList";
import { useApplication } from "../../../core/hooks/useApplication";
import { Page } from "../../../core/components/Page";
import { MetricTimeRangePicker } from "./components/MetricTimeRangePicker";
import { useMetricsRange } from "../../../core/hooks/useMetricsRange";
import { useRequest } from "../../../core/hooks/useRequest";
import { ConnectionStatus, DataSourceConnStatus } from "@traceo/types";

const MetricsPage = () => {
  const dispatch = useAppDispatch();

  const { application } = useApplication();
  const { metrics, hasFetched } = useSelector((state: StoreState) => state.metrics);
  const [search, setSearch] = useState<string>(null);
  const { ranges, setRanges } = useMetricsRange();

  const { data: connection, isLoading: isLoadingConnection } =
    useRequest<DataSourceConnStatus>({
      url: "/api/datasource/heartbeat",
      params: {
        id: application?.tsdbDatasource
      }
    });

  useEffect(() => {
    dispatch(loadMetrics({ search }));
  }, [search]);

  const isConnected = !!application?.tsdbDatasource;

  const renderContent = () => {
    if (!isConnected) {
      return <NotConnectedTSDB />;
    }

    return (
      <>
        <Card className="rounded-md mb-2">
          <SearchWrapper className="justify-end">
            <InputSearch
              value={search}
              onChange={setSearch}
              placeholder="Search metric by name, description or series details"
            />
            <MetricTimeRangePicker ranges={ranges} setRanges={setRanges} />
          </SearchWrapper>
        </Card>
        {connection?.status === ConnectionStatus.FAILED && (
          <Alert
            type="error"
            title="Connection error. Check configuration to your time series database."
            message={`Error: ${connection?.error}`}
            className="mb-2"
          />
        )}
        <ConditionalWrapper
          isEmpty={metrics?.length === 0}
          emptyView={<EmptyMetricsList constraints={search} />}
          isLoading={!hasFetched || isLoadingConnection}
        >
          <Row gap="2" cols={12}>
            {metrics?.map((metric, index) => (
              <Col span={6} key={index}>
                <MetricCard metric={metric} ranges={ranges} />
              </Col>
            ))}
          </Row>
        </ConditionalWrapper>
      </>
    );
  };

  return (
    <Page
      header={{
        icon: <BarChartOutlined />,
        title: "Metrics",
        description: "View metrics from your app after connecting and configuring the SDK"
      }}
    >
      <Page.Content>{renderContent()}</Page.Content>
    </Page>
  );
};

export default MetricsPage;

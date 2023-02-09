import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { ConnectionStatus } from "@traceo/types";
import { ConnectionError } from "./components/ConnectionError";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useAppDispatch } from "../../../store";
import { loadMetrics } from "./state/actions";
import { BarChartOutlined, LoadingOutlined } from "@ant-design/icons";
import { MetricCard } from "./components/MetricCard";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { notify } from "../../../core/utils/notify";
import { metricsApi } from "./api";
import { InputSearch, Button, Card, Row, Col } from "@traceo/ui";
import { EmptyMetricsList } from "./components/EmptyMetricsList";
import { useApplication } from "../../../core/hooks/useApplication";
import { Page } from "../../../core/components/Page";
import { MetricTimeRangePicker } from "./components/MetricTimeRangePicker";
import { useMetricsRange } from "src/core/hooks/useMetricsRange";

const MetricsPage = () => {
  const dispatch = useAppDispatch();

  const { application } = useApplication();
  const { metrics, hasFetched } = useSelector((state: StoreState) => state.metrics);
  const [search, setSearch] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { ranges, setRanges } = useMetricsRange();

  useEffect(() => {
    dispatch(
      loadMetrics({
        search
      })
    );
  }, [search]);

  const reloadMetrics = async () => {
    await metricsApi.reload(application.id, (e) => setLoading(e));
    notify.success("Refreshed");
  };

  const isConnectedTSDB = !!application?.tsdbProvider;

  const isConnectedSuccessfully =
    application?.influxConfig?.connStatus === ConnectionStatus.CONNECTED;

  const renderContent = () => {
    if (!isConnectedTSDB) {
      return <NotConnectedTSDB />;
    }

    if (!isConnectedSuccessfully) {
      return <ConnectionError />;
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
            <Button icon={loading && <LoadingOutlined />} onClick={reloadMetrics}>
              Refresh
            </Button>
          </SearchWrapper>
        </Card>
        <ConditionalWrapper
          isEmpty={metrics?.length === 0}
          emptyView={<EmptyMetricsList constraints={search} />}
          isLoading={!hasFetched}
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

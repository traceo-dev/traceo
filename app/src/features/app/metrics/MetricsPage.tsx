import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { CONNECTION_STATUS } from "../../../types/tsdb";
import { ConnectionError } from "./components/ConnectionError";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useAppDispatch } from "../../../store";
import { loadMetrics } from "./state/actions";
import { BarChartOutlined, SyncOutlined } from "@ant-design/icons";
import { MetricCard } from "./components/MetricCard";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { notify } from "../../../core/utils/notify";
import { TimeLimitDropdown } from "./components/TimeLimitDropdown";
import { getLocalStorageTimeLimit } from "../../../core/utils/localStorage";
import { searchMetric } from "./utils/searchUtil";
import { metricsApi } from "./api";
import { InputSearch } from "core/ui-components/Input/InputSearch";
import { Button } from "core/ui-components/Button";
import { Card } from "core/ui-components/Card";
import { EmptyMetricsList } from "./components/EmptyMetricsList";
import { Row } from "core/ui-components/Row";
import { Col } from "core/ui-components/Col";
import { useApplication } from "core/hooks/useApplication";
import { Page } from "core/components/Page";

const MetricsPage = () => {
  const DEFAULT_TIME_LIMIT = getLocalStorageTimeLimit() || 12;
  const dispatch = useAppDispatch();

  const { application } = useApplication();
  const { metrics, hasFetched } = useSelector((state: StoreState) => state.metrics);
  const [timeLimit, setTimeLimit] = useState<number>(DEFAULT_TIME_LIMIT);
  const [search, setSearch] = useState<string>(null);

  useEffect(() => {
    dispatch(loadMetrics());
  }, [application]);

  const reloadMetrics = async () => {
    await metricsApi.reload(application.id);
    notify.success("Refreshed");
  };

  const isConnectedTSDB = !!application?.connectedTSDB;

  const isConnectedSuccessfully =
    application?.influxDS?.connStatus === CONNECTION_STATUS.CONNECTED;

  const filteredMetrics = searchMetric(search, metrics) || [];

  const renderContent = () => {
    if (!isConnectedTSDB) {
      return <NotConnectedTSDB />;
    }

    if (!isConnectedSuccessfully) {
      return <ConnectionError />;
    }

    return (
      <>
        <SearchWrapper className="pt-2 pb-12 justify-end">
          <InputSearch
            value={search}
            onChange={setSearch}
            placeholder="Search metric by name, description or series details"
          />
          <TimeLimitDropdown setTimeLimit={setTimeLimit} timeLimit={timeLimit} />
          <Button icon={<SyncOutlined />} onClick={reloadMetrics}>
            Refresh metrics
          </Button>
        </SearchWrapper>
        <ConditionalWrapper
          isEmpty={filteredMetrics?.length === 0}
          emptyView={<EmptyMetricsList constraints={search} />}
          isLoading={!hasFetched}
        >
          <Row gap="2" cols={12}>
            {filteredMetrics?.map((metric, index) => (
              <Col span={4} key={index}>
                <MetricCard metric={metric} hrCount={timeLimit} />
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
      <Page.Content>
        <Card>{renderContent()}</Card>
      </Page.Content>
    </Page>
  );
};

export default MetricsPage;

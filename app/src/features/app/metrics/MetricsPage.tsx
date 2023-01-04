import { Button, Col, Row } from "antd";
import { PagePanel } from "../../../core/components/PagePanel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { CONNECTION_STATUS } from "../../../types/tsdb";
import AppMetricsNavigationPage from "./components/AppMetricsNavigationPage";
import { ConnectionError } from "./components/ConnectionError";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { dispatch } from "../../../store/store";
import { loadMetrics } from "./state/actions";
import { SyncOutlined } from "@ant-design/icons";
import { MetricCard } from "./components/MetricCard";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { notify } from "../../../core/utils/notify";
import { TimeLimitDropdown } from "./components/TimeLimitDropdown";
import { getLocalStorageTimeLimit } from "../../../core/utils/localStorage";
import { searchMetric } from "./utils/searchUtil";
import { metricsApi } from "./api";
import { InputSearch } from "core/ui-components/Input/InputSearch";

const MetricsPage = () => {
  const DEFAULT_TIME_LIMIT = getLocalStorageTimeLimit() || 12;

  const { application } = useSelector((state: StoreState) => state.application);
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
          <Button onClick={reloadMetrics} type="primary">
            <SyncOutlined />
            Refresh metrics
          </Button>
        </SearchWrapper>
        <ConditionalWrapper isLoading={!hasFetched}>
          <Row className="gap-0" gutter={[8, 24]}>
            {searchMetric(search, metrics).map((metric, index) => (
              <Col span={8} key={index}>
                <MetricCard metric={metric} hrCount={timeLimit} />
              </Col>
            ))}
          </Row>
        </ConditionalWrapper>
      </>
    );
  };

  return (
    <AppMetricsNavigationPage>
      <PagePanel>{renderContent()}</PagePanel>
    </AppMetricsNavigationPage>
  );
};

export default MetricsPage;

import { Button, Col, Divider, Row } from "antd";
import { PagePanel } from "../../../core/components/PagePanel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { CONNECTION_STATUS, DataSourceConnStatus } from "../../../types/tsdb";
import AppMetricsNavigationPage from "./components/AppMetricsNavigationPage";
import { ConnectionError } from "./components/ConnectionError";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";
import { ConditionalWrapper } from "core/components/ConditionLayout";
import { dispatch } from "store/store";
import { loadMetrics } from "./state/actions";
import { SyncOutlined } from "@ant-design/icons";
import { MetricCard } from "./components/MetricCard";
import { SearchWrapper } from "core/components/SearchWrapper";
import { loadApplication } from "../state/application/actions";
import api from "core/lib/api";
import { notify } from "core/utils/notify";
import { ApiResponse } from "types/api";
import { TimeLimitDropdown } from "./components/TimeLimitDropdown";
import { getLocalStorageMetricHrCount } from "core/utils/localStorage";
import { SearchInput } from "core/components/SearchInput";

const DEFAULT_TIME_LIMIT = getLocalStorageMetricHrCount() || 12;

const MetricsPage = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const { metrics, hasFetched } = useSelector((state: StoreState) => state.metrics);
  const [timeLimit, setTimeLimit] = useState<number>(DEFAULT_TIME_LIMIT);

  useEffect(() => {
    dispatch(loadMetrics());
  }, [application]);

  const reloadMetrics = async () => {
    await api
      .get<ApiResponse<DataSourceConnStatus>>("/api/influx/connection/check", {
        id: application.id
      })
      .then((resp) => {
        const status = resp.data.status;
        if (status === CONNECTION_STATUS.CONNECTED) {
          dispatch(loadMetrics());
        }

        dispatch(loadApplication());
      });

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
          <SearchInput
            value={""}
            setValue={function (_val: string): void {
              throw new Error("Function not implemented.");
            }}
          />
          <TimeLimitDropdown setTimeLimit={setTimeLimit} timeLimit={timeLimit} />
          <Button onClick={reloadMetrics} type="primary">
            <SyncOutlined />
            Refresh metrics
          </Button>
        </SearchWrapper>
        <ConditionalWrapper isLoading={!hasFetched}>
          <Row className="gap-0" gutter={[8, 24]}>
            {metrics?.map((metric, index) => (
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

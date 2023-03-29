import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { Page } from "../../../core/components/Page";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { useAppDispatch } from "../../../store";
import { MetricCard } from "./components/MetricCard";
import { MetricTimeRangePicker } from "./components/MetricTimeRangePicker";
import { loadMetrics } from "./state/actions";
import { BarChartOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import { InputSearch, Card, Row, Col } from "@traceo/ui";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { EmptyMetricsList } from "./components/EmptyMetricsList";

const MetricsPage = () => {
  const dispatch = useAppDispatch();

  const { metrics, hasFetched } = useSelector((state: StoreState) => state.metrics);
  const [search, setSearch] = useState<string>(null);
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  useEffect(() => {
    dispatch(loadMetrics({ search }));
  }, [search]);

  const renderContent = () => {
    return (
      <div>
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
      </div>
    );
  };

  return (
    <Page
      header={{
        icon: <BarChartOutlined />,
        title: "Metrics",
        description: "View metrics from your project after connecting and configuring the SDK"
      }}
    >
      <Page.Content>{renderContent()}</Page.Content>
    </Page>
  );
};

export default MetricsPage;

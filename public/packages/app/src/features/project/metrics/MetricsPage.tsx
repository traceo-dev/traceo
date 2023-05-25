import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { Page } from "../../../core/components/Page";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { MetricCard } from "./components/MetricCard";
import { MetricTimeRangePicker } from "./components/MetricTimeRangePicker";
import { BarChartOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Row, Col, Button, InputSearch } from "@traceo/ui";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { EmptyMetricsList } from "./components/EmptyMetricsList";
import { Link, useParams } from "react-router-dom";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { IMetric } from "@traceo/types";

const MetricsPage = () => {
  const { id } = useParams();

  const [search, setSearch] = useState<string>(null);
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const {
    data: metrics,
    refetch,
    isLoading,
    isFetching
  } = useReactQuery<IMetric[]>({
    queryKey: [`metrics_${id}`],
    url: `/api/metrics/${id}`,
    params: { search }
  });

  useEffect(() => {
    refetch();
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
          isLoading={isLoading}
        >
          <Row gap="2" cols={12}>
            {metrics?.map((metric, index) => (
              <Col span={6} key={index}>
                <MetricCard metric={metric} ranges={ranges} setRanges={setRanges} />
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
        description: "View metrics from your project after connecting and configuring the SDK",
        suffix: (
          <Link to={`/project/${id}/metrics/create`}>
            <Button icon={<PlusOutlined />}>New metric</Button>
          </Link>
        )
      }}
    >
      <Page.Content>{renderContent()}</Page.Content>
    </Page>
  );
};

export default MetricsPage;

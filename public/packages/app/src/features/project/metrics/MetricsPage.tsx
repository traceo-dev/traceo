import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { MetricCard } from "./components/MetricCard";
import { BarChartOutlined, PlusOutlined } from "@ant-design/icons";
import { Row, Button } from "@traceo/ui";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import { IMetric } from "@traceo/types";
import { MetricTimeToolbar } from "./components/MetricTimeToolbar";

const MetricsPage = () => {
  const { id } = useParams();

  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const { data: metrics = [], isLoading } = useReactQuery<IMetric[]>({
    queryKey: [`metrics_${id}`],
    url: `/api/metrics/${id}`
  });

  return (
    <Page
      header={{
        icon: <BarChartOutlined />,
        title: "Metrics",
        description:
          "Use the SDK to collect metrics data from your software about its performance and everything else.",
        suffix: (
          <Link to={`/project/${id}/metrics/create`} className="text-primary hover:text-white">
            <Button size="sm" icon={<PlusOutlined />}>
              Add new metric
            </Button>
          </Link>
        )
      }}
      headerDivider={true}
    >
      <Page.Content className="pt-0">
        <Row className="justify-end my-5">
          <MetricTimeToolbar variant="secondary" ranges={ranges} setRanges={setRanges} />
        </Row>
        <ConditionalWrapper isEmpty={metrics?.length === 0} isLoading={isLoading}>
          <div className="grid grid-cols-12 gap-x-1">
            {metrics.map((metric, key) => (
              <MetricCard key={key} metric={metric} ranges={ranges} setRanges={setRanges} />
            ))}
          </div>
        </ConditionalWrapper>
      </Page.Content>
    </Page>
  );
};

export default MetricsPage;

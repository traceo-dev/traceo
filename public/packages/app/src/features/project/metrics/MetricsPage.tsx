import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { Page } from "../../../core/components/Page";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { MetricCard } from "./components/MetricCard";
import { BarChartOutlined, PlusOutlined } from "@ant-design/icons";
import { Row, Col } from "@traceo/ui";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { IMetric } from "@traceo/types";
import { ActionButton } from "../explore/components/ActionButton";
import { MetricTimeToolbar } from "./components/MetricTimeToolbar";
import { OptionsCollapseGroup } from "../explore/components/OptionsCollapseGroup";

const MetricsPage = () => {
  const { id } = useParams();

  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const { data: metrics, isLoading } = useReactQuery<IMetric[]>({
    queryKey: [`metrics_${id}`],
    url: `/api/metrics/${id}`
  });

  return (
    <Page>
      <Page.Content>
        <div className="w-full flex flex-row py-3 justify-end gap-x-3">
          <Link to={`/project/${id}/metrics/create`}>
            <ActionButton
              name="Add new metric"
              inactiveColor="bg-primary"
              icon={<PlusOutlined />}
            />
          </Link>
          <MetricTimeToolbar ranges={ranges} setRanges={setRanges} />
        </div>

        <OptionsCollapseGroup title="Options">
          <>xxx</>
        </OptionsCollapseGroup>

        <ConditionalWrapper isEmpty={metrics?.length === 0} isLoading={isLoading}>
          <Row gap="2" cols={12}>
            {metrics?.map((metric, index) => (
              <Col span={6} key={index}>
                <MetricCard metric={metric} ranges={ranges} setRanges={setRanges} />
              </Col>
            ))}
          </Row>
        </ConditionalWrapper>
      </Page.Content>
    </Page>
  );
};

export default MetricsPage;

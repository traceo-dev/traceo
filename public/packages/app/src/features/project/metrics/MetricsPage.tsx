import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { Page } from "../../../core/components/Page";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { MetricCard } from "./components/MetricCard";
import { MetricTimeRangePicker } from "./components/MetricTimeRangePicker";
import {
  BarChartOutlined,
  CaretRightFilled,
  PauseOutlined,
  PlusOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { Card, Row, Col, Button, InputSearch, conditionClass } from "@traceo/ui";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { EmptyMetricsList } from "./components/EmptyMetricsList";
import { Link, useParams } from "react-router-dom";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { IMetric } from "@traceo/types";
import { ActionButton } from "../explore/components/ActionButton";

const LIVE_INTERVAL = 15000; //15s

const getCurrentRange = (): [number, number] => {
  const from = dayjs().subtract(2, "h").unix();
  const to = dayjs().unix();

  return [from, to];
};

const MetricsPage = () => {
  const { id } = useParams();

  const [search, setSearch] = useState<string>(null);
  const [live, setLive] = useState<boolean>(false);
  const [isTimeDisabled, setTimeDisabled] = useState<boolean>(false);
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const {
    data: metrics,
    refetch,
    isLoading
  } = useReactQuery<IMetric[]>({
    queryKey: [`metrics_${id}`],
    url: `/api/metrics/${id}`,
    params: { search }
  });

  useEffect(() => {
    refetch();
  }, [search]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (live) {
      intervalId = setInterval(() => {
        setRanges(getCurrentRange());
      }, LIVE_INTERVAL);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [live]);

  const onLive = () => {
    const isLive = !live;

    if (isLive) {
      setRanges(getCurrentRange());
    }

    setLive(isLive);
    setTimeDisabled(isLive);
  };

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
            <MetricTimeRangePicker
              isDisabled={isTimeDisabled}
              ranges={ranges}
              setRanges={setRanges}
            />
            <ActionButton
              tooltip={live ? "Pause live" : "Live"}
              isActive={live}
              icon={live ? <PauseOutlined /> : <CaretRightFilled />}
              onClick={() => onLive()}
            />
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

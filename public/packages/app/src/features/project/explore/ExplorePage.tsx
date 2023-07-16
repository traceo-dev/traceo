import { Button, Row, Select, SelectOptionProps, toTitleCase } from "@traceo/ui";
import { Page } from "../../../core/components/Page";
import { FC, useEffect, useRef, useState } from "react";
import {
  AlignLeftOutlined,
  BarChartOutlined,
  CaretRightFilled,
  NodeExpandOutlined
} from "@ant-design/icons";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import dayjs from "dayjs";
import { LogsPage } from "./logs/LogsPage";
import { TracesPage } from "./tracing/TracesPage";
import { EXPLORE_TYPE, Setter, TimeRange } from "@traceo/types";
import { ExploreRangePicker } from "./components/ExploreRangePicker";
import { MetricsPage } from "./metrics/MetricsPage";
import { urlService } from "../../../core/lib/url";
import { useParams } from "react-router-dom";

const exploreOptions: SelectOptionProps[] = [
  {
    label: "Logs",
    value: EXPLORE_TYPE.LOGS,
    icon: <AlignLeftOutlined className="text-yellow-500" />
  },
  {
    label: "Metrics",
    value: EXPLORE_TYPE.METRICS,
    icon: <BarChartOutlined className="text-yellow-500" />
  },
  {
    label: "Traces",
    value: EXPLORE_TYPE.TRACING,
    icon: <NodeExpandOutlined className="text-yellow-500" />
  }
];

export interface ExploreViewProps {
  ranges: TimeRange;
  setRanges: Setter<TimeRange>;
  loading: boolean;
  setLoading: Setter<boolean>;
  error: boolean;
  setError: Setter<boolean>;
}

export const ExplorePageWrapper: FC = () => {
  const ref = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const type = urlService.getParam<EXPLORE_TYPE>("type");
  const [exploreType, setExploreType] = useState<EXPLORE_TYPE>(type);

  useEffect(() => {
    setExploreType(type);
  }, [type]);

  useEffect(() => {
    urlService.setParams({
      type: exploreType
    });
  }, [exploreType]);

  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(30, "minute").unix(),
    to: dayjs().unix()
  });

  const onClickSearch = async () => {
    try {
      await ref.current.fetch();
    } catch (err) {
      console.log(err);
    }
  };

  const props = {
    ranges,
    setRanges,
    loading,
    setLoading,
    error,
    setError
  };

  const getDocumentTitle = () => {
    return `Explore - ${toTitleCase(exploreType)}`;
  };

  return (
    <Page title={getDocumentTitle()}>
      <Page.Content>
        <Row className="w-full pb-2 justify-between">
          <Select
            variant="secondary"
            options={exploreOptions}
            value={exploreType}
            onChange={(opt) => setExploreType(opt?.value)}
          />
          <Row gap="x-3" className="text-sm">
            <ExploreRangePicker
              range={ranges}
              maxRange={exploreType === EXPLORE_TYPE.TRACING ? 168 : undefined}
              setRange={(e) => setRanges(e)}
              type={exploreType}
            />
            <Button
              icon={<CaretRightFilled />}
              className="bg-red-500"
              variant={loading ? "danger" : "primary"}
              loading={loading}
              onClick={() => onClickSearch()}
            >
              Run
            </Button>
          </Row>
        </Row>

        {exploreType === EXPLORE_TYPE.LOGS && <LogsPage {...props} ref={ref} />}
        {exploreType === EXPLORE_TYPE.TRACING && <TracesPage {...props} ref={ref} />}
        {exploreType === EXPLORE_TYPE.METRICS && <MetricsPage {...props} ref={ref} />}
      </Page.Content>
    </Page>
  );
};

export default ExplorePageWrapper;

import { Button, Row, Select, SelectOptionProps } from "@traceo/ui";
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

  const [type, setType] = useState<EXPLORE_TYPE>(urlService.getParam<EXPLORE_TYPE>("type"));

  useEffect(() => {
    urlService.setParams({
      type: type
    });
  }, [type]);

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

  return (
    <Page>
      <Page.Content>
        <Row className="w-full py-3 justify-between">
          <Select
            variant="secondary"
            options={exploreOptions}
            value={type}
            onChange={(opt) => setType(opt?.value)}
          />
          <Row gap="x-3" className="text-sm">
            <ExploreRangePicker
              range={ranges}
              maxRange={type === EXPLORE_TYPE.TRACING ? 168 : 168}
              setRange={(e) => setRanges(e)}
              type={type}
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

        {type === EXPLORE_TYPE.LOGS && <LogsPage {...props} ref={ref} />}
        {type === EXPLORE_TYPE.TRACING && <TracesPage {...props} ref={ref} />}
        {type === EXPLORE_TYPE.METRICS && <MetricsPage {...props} ref={ref} />}
      </Page.Content>
    </Page>
  );
};

export default ExplorePageWrapper;

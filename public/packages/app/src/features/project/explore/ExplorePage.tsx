import { Row, Select, SelectOptionProps, toTitleCase } from "@traceo/ui";
import { Page } from "../../../core/components/Page";
import { FC, useEffect, useRef, useState } from "react";
import { AlignLeftOutlined, BarChartOutlined, NodeExpandOutlined } from "@ant-design/icons";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import dayjs from "dayjs";
import { LogsPage } from "./logs/LogsPage";
import { TracesPage } from "./tracing/TracesPage";
import { EXPLORE_TYPE, Setter, TimeRange } from "@traceo/types";
import { MetricsPage } from "./metrics/MetricsPage";
import { urlService } from "../../../core/lib/url";
import { ExploreToolbar } from "./components/ExploreToolbar";

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
    label: "Spans",
    value: EXPLORE_TYPE.SPANS,
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
    onChangeExploreType(type);
  }, [type]);

  const onChangeExploreType = (type: EXPLORE_TYPE) => {
    setExploreType(type);
    urlService.setParams({
      type: type
    });
  };

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

  const renderContent = () => {
    switch (type) {
      case EXPLORE_TYPE.LOGS:
        return <LogsPage {...props} ref={ref} />;
      case EXPLORE_TYPE.METRICS:
        return <MetricsPage {...props} ref={ref} />;
      case EXPLORE_TYPE.SPANS:
        return <TracesPage {...props} ref={ref} />;
      default:
        break;
    }
  };

  return (
    <Page title={getDocumentTitle()}>
      <ExploreToolbar
        loading={loading}
        ranges={ranges}
        setRanges={setRanges}
        onClickSearch={onClickSearch}
      />
      <Page.Content>
        <Row className="w-full pb-2 justify-between">
          <Select
            variant="secondary"
            options={exploreOptions}
            value={exploreType}
            onChange={(opt) => onChangeExploreType(opt?.value)}
          />
        </Row>

        {renderContent()}
      </Page.Content>
    </Page>
  );
};

export default ExplorePageWrapper;

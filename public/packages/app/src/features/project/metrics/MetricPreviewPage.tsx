import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { conditionClass } from "../../../core/utils/classes";
import { MetricCustomizeForm } from "./components/MetricCustomizeForm";
import { MetricPreviewHeader } from "./components/MetricPreviewHeader";
import { MetricToolbar } from "./components/MetricToolbar";
import { IMetric, DeepPartial, MetricPreviewType } from "@traceo/types";
import { Card, Row } from "@traceo/ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import MetricPreviewChart from "../../../core/components/Charts/Metrics/MetricPreviewChart";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { LoadingOutlined } from "@ant-design/icons";
import { isEmptyObject } from "../../../core/utils/object";
import { TraceoLoading } from "../../../core/components/TraceoLoading";

export const MetricPreviewPage = () => {
  const { metricId, id } = useParams();
  const { ranges, setRanges } = useTimeRange();
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(undefined);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);

  const { data, refetch, isLoading, isRefetching } = useReactQuery<MetricPreviewType>({
    queryKey: [`metric_ds_${metricId}`],
    url: `/api/metrics/${id}/preview/${metricId}`,
    params: {
      from: ranges[0],
      to: ranges[1]
    }
  });

  useEffect(() => {
    refetch();
  }, [ranges, metricId]);

  useEffect(() => {
    if (data && data.options) {
      setOptions(data.options);
    }
  }, [data]);

  if (!options || isEmptyObject(options)) {
    return <TraceoLoading />;
  }

  return (
    <Page isLoading={isLoading}>
      <MetricPreviewHeader
        currentOptions={options}
        isCustomizeMode={isCustomizeMode}
        setCustomizeMode={setCustomizeMode}
        setOptions={setOptions}
        reload={() => refetch()}
      />
      <Page.Content>
        <div className="w-full grid grid-cols-12">
          <div className={conditionClass(isCustomizeMode, "col-span-8", "col-span-12")}>
            <Card
              title="Graph"
              extra={
                <Row gap="x-5">
                  <MetricToolbar
                    isCustomizeMode={isCustomizeMode}
                    ranges={ranges}
                    setCustomizeMode={setCustomizeMode}
                    setRanges={setRanges}
                  />
                  {isRefetching && <LoadingOutlined />}
                </Row>
              }
            >
              <ConditionalWrapper isLoading={isLoading}>
                <MetricPreviewChart
                  datasource={data?.datasource}
                  isLoading={isLoading}
                  ranges={ranges}
                  setRanges={setRanges}
                  options={options}
                  activeZoomSelect={!isCustomizeMode}
                />
              </ConditionalWrapper>
            </Card>
          </div>
          {isCustomizeMode && <MetricCustomizeForm setOptions={setOptions} options={options} />}
        </div>
      </Page.Content>
    </Page>
  );
};

export default MetricPreviewPage;

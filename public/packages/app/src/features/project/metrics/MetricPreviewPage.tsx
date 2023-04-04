import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { conditionClass } from "../../../core/utils/classes";
import { useAppDispatch } from "../../../store";
import { MetricCustomizeForm } from "./components/MetricCustomizeForm";
import { MetricPreviewHeader } from "./components/MetricPreviewHeader";
import { MetricToolbar } from "./components/MetricToolbar";
import { loadMetric } from "./state/actions";
import { StoreState } from "@store/types";
import { IMetric, DeepPartial } from "@traceo/types";
import { Card } from "@traceo/ui";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import MetricPreviewChart from "../../../core/components/Charts/Metrics/MetricPreviewChart";
import { useRequest } from "src/core/hooks/useRequest";
import { MetricTableWrapper } from "./components/MetricTableWrapper";

export const MetricPreviewPage = () => {
  const { metricId, id } = useParams();
  const dispatch = useAppDispatch();
  const { ranges, setRanges } = useTimeRange();
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(metric?.options);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);

  useEffect(() => {
    const payload = {
      projectId: id,
      metricId,
      from: ranges[0],
      to: ranges[1]
    };
    dispatch(loadMetric(payload));
  }, [ranges]);

  const fields = metric?.options?.series.map(({ field }) => field);
  const {
    data: datasource,
    execute,
    isLoading
  } = useRequest<any>({
    url: `/api/metrics/${id}/datasource/table`,
    params: {
      fields,
      from: ranges[0],
      to: ranges[1]
    },
    executeOnInit: false
  });

  useEffect(() => {
    if (metric) {
      setOptions(metric.options);
      execute();
    }
  }, [metric]);

  return (
    <Page isLoading={!hasFetchedMetric || !metric?.options}>
      <MetricPreviewHeader
        currentOptions={options}
        isCustomizeMode={isCustomizeMode}
        setCustomizeMode={setCustomizeMode}
        setOptions={setOptions}
      />
      <Page.Content>
        <div className="w-full grid grid-cols-12">
          <div className={conditionClass(isCustomizeMode, "col-span-8", "col-span-12")}>
            <Card
              title="Graph"
              extra={
                <MetricToolbar
                  isCustomizeMode={isCustomizeMode}
                  ranges={ranges}
                  setCustomizeMode={setCustomizeMode}
                  setRanges={setRanges}
                />
              }
            >
              <MetricPreviewChart
                setRanges={setRanges}
                options={options}
                activeZoomSelect={!isCustomizeMode}
              />
            </Card>
            <MetricTableWrapper
              metric={metric?.options}
              metricData={datasource}
              isLoading={isLoading}
            />
          </div>
          {isCustomizeMode && <MetricCustomizeForm setOptions={setOptions} options={options} />}
        </div>
      </Page.Content>
    </Page>
  );
};

export default MetricPreviewPage;

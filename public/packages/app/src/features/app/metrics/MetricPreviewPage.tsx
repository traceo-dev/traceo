import { MetricTableWrapper } from "./components/MetricTableWrapper";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { loadMetric } from "./state/actions";
import { conditionClass } from "../../../core/utils/classes";
import { MetricPreviewHeader } from "./components/MetricPreviewHeader";
import { MetricCustomizeForm } from "./components/MetricCustomizeForm";
import { IMetric, DeepPartial } from "@traceo/types";
import { useImmer } from "use-immer";
import { Card } from "@traceo/ui";
import { MetricPreviewPlot } from "../../../core/components/Plots";
import { Page } from "../../../core/components/Page";
import { MetricToolbar } from "./components/MetricToolbar";
import { useMetricsRange } from "src/core/hooks/useMetricsRange";

export const MetricPreviewPage = () => {
  const { metricId, id } = useParams();
  const dispatch = useAppDispatch();
  const { ranges, setRanges } = useMetricsRange();
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(metric?.options);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [isExpandMode, setExpandMode] = useState<boolean>(false);

  useEffect(() => {
    const payload = {
      appId: id,
      metricId,
      from: ranges[0],
      to: ranges[1]
    };
    dispatch(loadMetric(payload));
  }, [ranges]);

  useEffect(() => {
    if (metric) {
      setOptions(metric.options);
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
                  isExpandMode={isExpandMode}
                  ranges={ranges}
                  setCustomizeMode={setCustomizeMode}
                  setExpandMode={setExpandMode}
                  setRanges={setRanges}
                />
              }
            >
              <MetricPreviewPlot isExpandMode={isExpandMode} options={options} />
            </Card>

            {!isExpandMode && (
              <MetricTableWrapper metric={options} metricData={metric?.datasource} />
            )}
          </div>
          {isCustomizeMode && (
            <MetricCustomizeForm setOptions={setOptions} options={options} />
          )}
        </div>
      </Page.Content>
    </Page>
  );
};

export default MetricPreviewPage;

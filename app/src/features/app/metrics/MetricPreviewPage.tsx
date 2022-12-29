import { MetricPlotWrapper } from "./components/MetricPlotWrapper";
import { MetricTableWrapper } from "./components/MetricTableWrapper";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";
import AppPage from "../components/AppPage";
import { Typography } from "antd";
import { PagePanel } from "core/components/PagePanel";
import { ConditionalWrapper } from "core/components/ConditionLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dispatch } from "store/store";
import { loadMetric } from "./state/actions";
import { MetricPreviewPlot } from "core/components/Plots/components/Metrics/MetricPreviewPlot";
import { conditionClass } from "core/utils/classes";
import { MetricPreviewHeader } from "./components/MetricPreviewHeader";
import { MetricPreviewCustomizeForm } from "./components/MetricPreviewCustomizeForm";
import { useForm } from "antd/es/form/Form";
import { IMetric } from "types/metrics";
import { TraceoLoading } from "core/components/TraceoLoading";
import { useImmer } from "use-immer";
import { DeepPartial } from "redux";

export const MetricPreviewPage = () => {
  const { metricId, id } = useParams();
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(metric?.options);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    dispatch(loadMetric(id, metricId));
  }, []);

  useEffect(() => {
    if (metric) {
      setOptions(metric.options);
    }
  }, [metric]);

  if (!metric?.options) {
    return <TraceoLoading />;
  }

  const isDescriptionVisible =
    metric?.options?.description && options?.config.showDescription;

  return (
    <>
      <AppPage>
        <ConditionalWrapper isLoading={!hasFetchedMetric}>
          <MetricPreviewHeader
            form={form}
            isCustomizeMode={isCustomizeMode}
            setCustomizeMode={setCustomizeMode}
            setOptions={setOptions}
          />
          <div className="w-full grid grid-cols-12">
            <div className={conditionClass(isCustomizeMode, "col-span-9", "col-span-12")}>
              {isDescriptionVisible && (
                <PagePanel>
                  <Typography.Paragraph>
                    {metric?.options?.description}
                  </Typography.Paragraph>
                </PagePanel>
              )}
              <MetricPlotWrapper>
                <MetricPreviewPlot options={options} />
              </MetricPlotWrapper>
              <MetricTableWrapper
                metric={metric?.options}
                metricData={metric?.datasource}
              />
            </div>
            {isCustomizeMode && (
              <MetricPreviewCustomizeForm setOptions={setOptions} form={form} />
            )}
          </div>
        </ConditionalWrapper>
      </AppPage>
      <style>{`
        .ant-collapse > .ant-collapse-item > .ant-collapse-header {
          padding-left: 0px !important;
        }
    `}</style>
    </>
  );
};

export default MetricPreviewPage;

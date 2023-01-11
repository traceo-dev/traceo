import { MetricTableWrapper } from "./components/MetricTableWrapper";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import AppPage from "../components/AppPage";
import { Tooltip } from "antd";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dispatch } from "../../../store/store";
import { loadMetric } from "./state/actions";
import { MetricPreviewPlot } from "../../../core/components/Plots/components/Metrics/MetricPreviewPlot";
import { conditionClass } from "../../../core/utils/classes";
import { MetricPreviewHeader } from "./components/MetricPreviewHeader";
import { MetricPreviewCustomizeForm } from "./components/MetricPreviewCustomizeForm";
import { useForm } from "antd/es/form/Form";
import { IMetric } from "../../../types/metrics";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { useImmer } from "use-immer";
import { toggleNavbar } from "../state/navbar/actions";
import { CompressOutlined, ExpandOutlined } from "@ant-design/icons";
import { getLocalStorageTimeLimit } from "../../../core/utils/localStorage";
import { DeepPartial } from "../../../types/partials";
import ReactMarkdown from "react-markdown";
import { Card } from "core/ui-components/Card/Card";
import { Space } from "core/ui-components/Space/Space";

export const MetricPreviewPage = () => {
  const DEFAULT_TIME_LIMIT = getLocalStorageTimeLimit() || 12;

  const { metricId, id } = useParams();
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(metric?.options);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [isExpandMode, setExpandMode] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(DEFAULT_TIME_LIMIT);
  const [form] = useForm();

  useEffect(() => {
    dispatch(
      loadMetric({
        appId: id,
        metricId,
        hrCount: timeLimit
      })
    );
  }, [timeLimit]);

  useEffect(() => {
    if (metric) {
      setOptions(metric.options);
    }
  }, [metric]);

  if (!metric?.options) {
    return <TraceoLoading />;
  }

  const isDescriptionVisible = options?.showDescription;

  const onExpand = () => {
    dispatch(toggleNavbar(true));
    setExpandMode(true);
  };

  const onCompress = () => {
    dispatch(toggleNavbar(false));
    setExpandMode(false);
  };

  return (
    <>
      <AppPage>
        <ConditionalWrapper isLoading={!hasFetchedMetric}>
          <MetricPreviewHeader
            form={form}
            isCustomizeMode={isCustomizeMode}
            isExpandMode={isExpandMode}
            setCustomizeMode={setCustomizeMode}
            setOptions={setOptions}
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
          />

          <div className="w-full grid grid-cols-12">
            <div className={conditionClass(isCustomizeMode, "col-span-9", "col-span-12")}>
              {isDescriptionVisible && !isExpandMode && (
                <Card title="Description" className="h-min">
                  <ReactMarkdown>{metric?.options?.description}</ReactMarkdown>
                </Card>
              )}

              <Card
                title="Graph"
                className="h-min"
                extra={
                  <Space>
                    {!isExpandMode && !isCustomizeMode && (
                      <Tooltip title="Expand view">
                        <ExpandOutlined onClick={onExpand} />
                      </Tooltip>
                    )}

                    {isExpandMode && (
                      <Tooltip title="Compress view">
                        <CompressOutlined onClick={onCompress} />
                      </Tooltip>
                    )}
                  </Space>
                }
              >
                <MetricPreviewPlot isExpandMode={isExpandMode} options={options} />
              </Card>

              {!isExpandMode && (
                <MetricTableWrapper metric={options} metricData={metric?.datasource} />
              )}
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

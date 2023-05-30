import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { conditionClass } from "../../../core/utils/classes";
import { MetricCustomizeForm } from "./components/MetricCustomizeForm";
import { IMetric, DeepPartial, ApiResponse } from "@traceo/types";
import { Button, Card, Row } from "@traceo/ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import MetricPreviewChart from "../../../core/components/Charts/Metrics/MetricPreviewChart";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { DeleteOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { isEmptyObject } from "../../../core/utils/object";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { SearchWrapper } from "src/core/components/SearchWrapper";
import { MetricTimeToolbar } from "./components/MetricTimeToolbar";
import { ActionButton } from "../explore/components/ActionButton";
import api from "src/core/lib/api";
import { Confirm } from "src/core/components/Confirm";

export const MetricPreviewPage = () => {
  const navigate = useNavigate();
  const { metricId, id } = useParams();
  const { ranges, setRanges } = useTimeRange();
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(undefined);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);

  const { data, refetch, isLoading, isRefetching } = useReactQuery<any>({
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

  const onSave = async () => {
    setSaveLoading(true);
    await api
      .patch<ApiResponse<string>>(`/api/metrics/${metricId}/update`, options)
      .then(() => {
        refetch();
      })
      .finally(() => {
        setSaveLoading(false);
        setCustomizeMode && setCustomizeMode(false);
      });
  };

  const onDiscard = () => setCustomizeMode(false);

  const onRemove = async () => {
    setRemoveLoading(true);
    await api
      .delete<ApiResponse<string>>(`/api/metrics/${metricId}`)
      .then(() => {
        navigate(`/project/${id}/metrics`);
      })
      .finally(() => {
        setRemoveLoading(false);
      });
  };

  return (
    <Page isLoading={isLoading}>
      <Page.Content>
        <div className="w-full grid grid-cols-12">
          <div className={conditionClass(isCustomizeMode, "col-span-8 mr-5", "col-span-12")}>
            <div className="w-full flex flex-row py-3 justify-end gap-x-3">
              {!isCustomizeMode && (
                <Row gap="x-2">
                  <ActionButton
                    icon={<SettingOutlined />}
                    name="Edit metric"
                    onClick={() => setCustomizeMode(true)}
                    inactiveColor="bg-primary"
                  />
                  <Confirm
                    description="Are you sure that you want to remove this metric?"
                    onOk={() => onRemove()}
                  >
                    <ActionButton
                      icon={<DeleteOutlined />}
                      name="Remove metric"
                      inactiveColor="bg-primary"
                      className="hover:ring-red-500"
                    />
                  </Confirm>
                </Row>
              )}

              <MetricTimeToolbar ranges={ranges} setRanges={setRanges} />
            </div>
            <Card title={options.name} extra={isRefetching && <LoadingOutlined />}>
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
          {isCustomizeMode && (
            <div className="col-span-4">
              <div className="flex flex-row items-center justify-end mb-3 gap-x-3">
                <Button
                  loading={saveLoading}
                  variant="primary"
                  size="sm"
                  onClick={() => onSave()}
                >
                  Update
                </Button>
                <Button
                  loading={removeLoading}
                  variant="ghost"
                  size="sm"
                  onClick={() => onDiscard()}
                >
                  Cancel
                </Button>
              </div>
              <MetricCustomizeForm setOptions={setOptions} options={options} />
            </div>
          )}
        </div>
      </Page.Content>
    </Page>
  );
};

export default MetricPreviewPage;

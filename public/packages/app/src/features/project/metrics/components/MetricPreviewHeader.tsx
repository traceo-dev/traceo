import { useDemo } from "../../../..//core/hooks/useDemo";
import api from "../../../../core/lib/api";
import { ApiResponse, IMetric } from "@traceo/types";
import { PageHeader, Button, Space } from "@traceo/ui";
import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeepPartial } from "redux";
import { DraftFunction } from "use-immer";
import { PreviewPageHeader } from "../../../../core/components/PreviewPageHeader";
import { notify } from "../../../../core/utils/notify";
import { Confirm } from "../../../../core/components/Confirm";

interface Props {
  currentOptions: DeepPartial<IMetric>;
  isCustomizeMode: boolean;
  isCreateMode?: boolean;
  setCustomizeMode?: (val: boolean) => void;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
  reload?: () => void;
}
export const MetricPreviewHeader: FC<Props> = ({
  currentOptions,
  isCustomizeMode,
  isCreateMode = false,
  setCustomizeMode,
  setOptions,
  reload
}) => {
  const isDemo = useDemo();
  const navigate = useNavigate();

  const [opts, _] = useState(currentOptions);

  const { id, metricId } = useParams();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);

  const onConfirm = () => {
    if (!currentOptions.name) {
      notify.error("Metric name is required.");
      return;
    }

    const series = currentOptions.series;
    if (series.length === 0) {
      notify.error("You have to add at least one serie to this metric.");
      return;
    }

    const missingName = series.find((serie) => !serie?.name);
    if (missingName) {
      notify.error("Your metric serie does not have a required name value.");
      return;
    }

    const missingField = series.find((serie) => !serie?.field);
    if (missingField) {
      notify.error("Your metric serie does not have a required field value.");
      return;
    }

    isCreateMode ? onCreate() : onSave();
  };

  const onSave = async () => {
    setSaveLoading(true);
    await api
      .patch<ApiResponse<string>>(`/api/metrics/${metricId}/update`, currentOptions)
      .then(() => {
        console.log("onSave then");
        reload();
      })
      .finally(() => {
        setSaveLoading(false);
        setCustomizeMode && setCustomizeMode(false);
      });
  };

  const onCreate = async () => {
    setSaveLoading(true);
    await api
      .post<ApiResponse<unknown>>(`/api/metrics/${id}`, currentOptions)
      .then((resp) => {
        if (resp.status === "success") {
          navigate(`/project/${id}/metrics`);
        }
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const onDiscard = () => {
    if (!isCreateMode) {
      setOptions(opts);
      setCustomizeMode && setCustomizeMode(false);

      return;
    }

    navigate(`/project/${id}/metrics`);
  };

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
    <PageHeader
      className="mb-5"
      title={
        <PreviewPageHeader
          page="metrics"
          title={currentOptions?.name}
          description={currentOptions?.description}
        />
      }
      suffix={
        <Space>
          {(isCustomizeMode || isCreateMode) && (
            <div className="flex flex-row gap-x-1">
              {!isDemo && (
                <Button loading={saveLoading} variant="primary" onClick={() => onConfirm()}>
                  {isCreateMode ? "Create" : "Save"}
                </Button>
              )}

              <Button variant="danger" onClick={() => onDiscard()}>
                {isCreateMode ? "Cancel" : "Discard"}
              </Button>
            </div>
          )}

          {!opts?.isDefault && !isCustomizeMode && !isCreateMode && (
            <div className="flex flex-row gap-x-1">
              <Confirm
                description="Are you sure that you want to remove this metric?"
                onOk={() => onRemove()}
              >
                <Button loading={removeLoading} variant="danger">
                  Remove
                </Button>
              </Confirm>
            </div>
          )}
        </Space>
      }
    />
  );
};

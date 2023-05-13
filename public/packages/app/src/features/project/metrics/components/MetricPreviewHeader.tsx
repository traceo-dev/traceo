import { useDemo } from "../../../..//core/hooks/useDemo";
import { useTimeRange } from "../../../../core/hooks/useTimeRange";
import api from "../../../../core/lib/api";
import { useAppDispatch } from "../../../../store";
import { hideNavbar } from "../../../../store/internal/navbar/actions";
import { loadMetric } from "../state/actions";
import { StoreState } from "@store/types";
import { ApiResponse, IMetric } from "@traceo/types";
import { PageHeader, Button, Space } from "@traceo/ui";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DeepPartial } from "redux";
import { DraftFunction } from "use-immer";
import { PreviewPageHeader } from "../../../../core/components/PreviewPageHeader";
import { notify } from "src/core/utils/notify";

interface Props {
  currentOptions: DeepPartial<IMetric>;
  isCustomizeMode: boolean;
  isCreateMode?: boolean;
  setCustomizeMode?: (val: boolean) => void;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}
export const MetricPreviewHeader: FC<Props> = ({
  currentOptions,
  isCustomizeMode,
  isCreateMode = false,
  setCustomizeMode,
  setOptions
}) => {
  const dispatch = useAppDispatch();
  const isDemo = useDemo();
  const navigate = useNavigate();

  const { id } = useParams();
  const { metric } = useSelector((state: StoreState) => state.metrics);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);
  const { ranges } = useTimeRange(undefined, false);

  const onConfirm = () => {
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
      .patch<ApiResponse<string>>(`/api/metrics/${metric.options.id}/update`, currentOptions)
      .then(() => {
        const payload = {
          projectId: id,
          metricId: metric.options.id,
          from: ranges[0],
          to: ranges[1]
        };
        dispatch(loadMetric(payload));
      })
      .finally(() => {
        setSaveLoading(false);
        setCustomizeMode && setCustomizeMode(false);
        dispatch(hideNavbar(false));
      });
  };

  const onCreate = async () => {
    setSaveLoading(true);
    await api
      .post<ApiResponse<unknown>>(`/api/metrics/${id}`, currentOptions)
      .then(() => {
        navigate(`/project/${id}/metrics`);
      })
      .finally(() => {
        setSaveLoading(false);
        dispatch(hideNavbar(false));
      });
  };

  const onDiscard = () => {
    if (!isCreateMode) {
      setOptions(metric?.options);
      setCustomizeMode && setCustomizeMode(false);
      dispatch(hideNavbar(false));

      return;
    }

    navigate(`/project/${id}/metrics`);
  };

  const onRemove = async () => {
    setRemoveLoading(true);
    await api
      .delete<ApiResponse<string>>(`/api/metrics/${metric?.options.id}`)
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

          {!metric?.options?.isDefault && !isCustomizeMode && !isCreateMode && (
            <div className="flex flex-row gap-x-1">
              <Button loading={removeLoading} variant="danger" onClick={() => onRemove()}>
                Remove
              </Button>
            </div>
          )}
        </Space>
      }
    />
  );
};

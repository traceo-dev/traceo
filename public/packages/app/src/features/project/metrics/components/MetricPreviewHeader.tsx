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
import { PreviewPageHeader } from "src/core/components/PreviewPageHeader";

interface Props {
  currentOptions: DeepPartial<IMetric>;
  isCustomizeMode: boolean;
  setCustomizeMode: (val: boolean) => void;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}
export const MetricPreviewHeader: FC<Props> = ({
  currentOptions,
  isCustomizeMode,
  setCustomizeMode,
  setOptions
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isDemo = useDemo();
  const { metric } = useSelector((state: StoreState) => state.metrics);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const { ranges } = useTimeRange();

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
        setCustomizeMode(false);
        dispatch(hideNavbar(false));
      });
  };

  const onDiscard = () => {
    setOptions(metric?.options);
    setCustomizeMode(false);
    dispatch(hideNavbar(false));
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
          {isCustomizeMode && (
            <div className="flex flex-row gap-x-1">
              {!isDemo && (
                <Button loading={saveLoading} variant="ghost" onClick={() => onSave()}>
                  Save
                </Button>
              )}

              <Button variant="danger" onClick={() => onDiscard()}>
                Discard
              </Button>
            </div>
          )}
        </Space>
      }
    />
  );
};

import { ArrowLeftOutlined } from "@ant-design/icons";
import { PageHeader, Button, Typography, Space } from "@traceo/ui";
import api from "../../../../core/lib/api";
import { toggleNavbar } from "../../../../store/internal/navbar/actions";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DeepPartial } from "redux";
import { useAppDispatch } from "../../../../store";
import { ApiResponse, IMetric } from "@traceo/types";
import { StoreState } from "@store/types";
import { DraftFunction } from "use-immer";
import { loadMetric } from "../state/actions";
import { useMetricsRange } from "../../../../core/hooks/useMetricsRange";

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
  const { metric } = useSelector((state: StoreState) => state.metrics);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const { ranges } = useMetricsRange();

  const onSave = async () => {
    setSaveLoading(true);
    await api
      .patch<ApiResponse<string>>(
        `/api/metrics/${metric.options.id}/update`,
        currentOptions
      )
      .then(() => {
        const payload = {
          appId: id,
          metricId: metric.options.id,
          from: ranges[0],
          to: ranges[1]
        };
        dispatch(loadMetric(payload));
      })
      .finally(() => {
        setSaveLoading(false);
        setCustomizeMode(false);
        dispatch(toggleNavbar(false));
      });
  };

  const onDiscard = () => {
    setOptions(metric?.options);
    setCustomizeMode(false);
    dispatch(toggleNavbar(false));
  };

  const onBack = () => {
    navigate({
      pathname: `/app/${id}/metrics`,
      search: `?from=${ranges[0]}&to=${ranges[1]}`
    });
    dispatch(toggleNavbar(false));
  };

  return (
    <PageHeader
      className="mb-5"
      title={
        <Space direction="vertical" className="gap-0 w-full">
          <Space
            onClick={onBack}
            className="max-w-min text-2xs cursor-pointer font-semibold text-primary rounded-lg py-0 hover:text-white"
          >
            <ArrowLeftOutlined />
            <Typography size="xxs" weight="semibold">
              METRICS
            </Typography>
          </Space>
          <Typography className="text-white text-3xl" weight="semibold">
            {currentOptions?.name}
          </Typography>
          <Typography className="pt-2">{currentOptions?.description}</Typography>
        </Space>
      }
      suffix={
        <Space>
          {isCustomizeMode && (
            <>
              <Button loading={saveLoading} variant="ghost" onClick={() => onSave()}>
                Save
              </Button>
              <Button variant="danger" onClick={() => onDiscard()}>
                Discard
              </Button>
            </>
          )}
        </Space>
      }
    />
  );
};

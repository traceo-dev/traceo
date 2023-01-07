import {
  BarChartOutlined,
  ArrowLeftOutlined,
  SyncOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Space, Typography, Tooltip } from "antd";
import { FormInstance } from "antd/es/form/Form";
import PageHeader from "../../../../core/components/PageHeader";
import api from "../../../../core/lib/api";
import { getLocalStorageTimeLimit } from "../../../../core/utils/localStorage";
import { toggleNavbar } from "../../../../features/app/state/navbar/actions";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DeepPartial } from "redux";
import { dispatch } from "../../../../store/store";
import { ApiResponse } from "../../../../types/api";
import { IMetric } from "../../../../types/metrics";
import { StoreState } from "../../../../types/store";
import { DraftFunction } from "use-immer";
import { loadMetric } from "../state/actions";
import { TimeLimitDropdown } from "./TimeLimitDropdown";
import { Button } from "core/ui-components/Button/Button";

interface Props {
  form: FormInstance;
  isCustomizeMode: boolean;
  isExpandMode: boolean;
  setCustomizeMode: (val: boolean) => void;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
  timeLimit: number;
  setTimeLimit: (val: number) => void;
}
export const MetricPreviewHeader: FC<Props> = ({
  form,
  isCustomizeMode,
  isExpandMode,
  setCustomizeMode,
  setOptions
  // timeLimit,
  // setTimeLimit
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { metric } = useSelector((state: StoreState) => state.metrics);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const onSave = async () => {
    setSaveLoading(true);

    const update = form.getFieldsValue();
    await api
      .patch<ApiResponse<string>>(`/api/metrics/${metric.options.id}/update`, update)
      .then(() => reloadMetric())
      .finally(() => {
        setSaveLoading(false);
        setCustomizeMode(false);
        dispatch(toggleNavbar(false));
      });
  };

  const reloadMetric = () => {
    dispatch(
      loadMetric({
        appId: id,
        metricId: metric.options.id,
        hrCount: getLocalStorageTimeLimit()
      })
    );
  };

  const onDiscard = () => {
    setOptions(metric?.options);
    setCustomizeMode(false);
    dispatch(toggleNavbar(false));
  };

  const onCustomize = () => {
    setCustomizeMode(true);
    dispatch(toggleNavbar(true));
  };

  return (
    <>
      <Space className="w-full justify-end"></Space>
      <PageHeader
        className="mb-5"
        title={
          <Space direction="vertical" className="gap-0 w-full">
            <Space
              onClick={() => {
                navigate(-1);
                dispatch(toggleNavbar(false));
              }}
              className="text-2xs cursor-pointer font-semibold text-primary rounded-lg py-0 hover:text-white"
            >
              <ArrowLeftOutlined />
              <Typography.Text>METRICS</Typography.Text>
            </Space>
            <Space>
              <BarChartOutlined />
              <Typography.Text className="text-2xl">
                {metric?.options?.name}
              </Typography.Text>
            </Space>
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

            {!isCustomizeMode && (
              <>
                {/* <TimeLimitDropdown setTimeLimit={setTimeLimit} timeLimit={timeLimit} /> */}
                <Button
                  hidden={isExpandMode}
                  icon={<SettingOutlined />}
                  variant="ghost"
                  onClick={() => onCustomize()}
                >
                  Customize
                </Button>
                <Tooltip title="Refresh">
                  <Button icon={<SyncOutlined />} onClick={() => reloadMetric()}>
                    Refresh
                  </Button>
                </Tooltip>
              </>
            )}
          </Space>
        }
      />
    </>
  );
};

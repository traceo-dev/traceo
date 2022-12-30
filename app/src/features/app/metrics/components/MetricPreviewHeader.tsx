import {
  BarChartOutlined,
  ArrowLeftOutlined,
  SyncOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Space, Typography, Button, Tooltip, Select } from "antd";
import { FormInstance } from "antd/es/form/Form";
import PageHeader from "core/components/PageHeader";
import api from "core/lib/api";
import { toggleNavbar } from "features/app/state/navbar/actions";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DeepPartial } from "redux";
import { dispatch } from "store/store";
import { ApiResponse } from "types/api";
import { IMetric } from "types/metrics";
import { StoreState } from "types/store";
import { DraftFunction } from "use-immer";
import { loadMetric } from "../state/actions";

interface Props {
  form: FormInstance;
  isCustomizeMode: boolean;
  isExpandMode: boolean;
  setCustomizeMode: (val: boolean) => void;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}
export const MetricPreviewHeader: FC<Props> = ({
  form,
  isCustomizeMode,
  isExpandMode,
  setCustomizeMode,
  setOptions
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
      .then(() => {
        dispatch(loadMetric(id, metric.options.id));
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

  const onCustomize = () => {
    setCustomizeMode(true);
    dispatch(toggleNavbar(true));
  };

  return (
    <>
      <PageHeader
        className="mb-5"
        title={
          <Space direction="vertical" className="gap-0 w-full">
            <Space
              onClick={() => {
                navigate(-1);
                dispatch(toggleNavbar(false));
              }}
              className="text-2xs cursor-pointer font-semibold text-primary rounded-lg py-0 px-2 hover:bg-secondary"
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
                <Button
                  loading={saveLoading}
                  type="primary"
                  ghost
                  onClick={() => onSave()}
                >
                  Save
                </Button>
                <Button type="primary" danger onClick={() => onDiscard()}>
                  Discard
                </Button>
              </>
            )}

            {!isCustomizeMode && (
              <>
                <Button
                  hidden={isExpandMode}
                  icon={<SettingOutlined />}
                  type="primary"
                  onClick={() => onCustomize()}
                  ghost
                >
                  Customize
                </Button>
                <Tooltip title="Refresh">
                  <Button
                    icon={<SyncOutlined className="text-xs cursor-pointer" />}
                    type="primary"
                    onClick={() => dispatch(loadMetric(id, metric.options.id))}
                  >
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

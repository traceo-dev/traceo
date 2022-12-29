import {
  BarChartOutlined,
  ArrowLeftOutlined,
  SyncOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Space, Typography, Button, Tooltip } from "antd";
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
  setCustomizeMode: (val: boolean) => void;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}
export const MetricPreviewHeader: FC<Props> = ({
  form,
  isCustomizeMode,
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
    <PageHeader
      className="mb-5"
      title={
        <Space direction="vertical" className="gap-0 w-full">
          <Space className="text-2xs font-semibold text-primary pb-0 mb-0">
            <BarChartOutlined />
            <Typography.Text>METRIC</Typography.Text>
          </Space>
          <Space>
            <ArrowLeftOutlined
              className="text-xl"
              onClick={() => {
                navigate(-1);
                dispatch(toggleNavbar(false));
              }}
            />
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
              <Button loading={saveLoading} type="primary" ghost onClick={() => onSave()}>
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
                icon={<SettingOutlined />}
                type="primary"
                onClick={() => onCustomize()}
                ghost
              >
                Customize
              </Button>
              <Tooltip title="Refresh">
                <Button type="primary">
                  <SyncOutlined className="text-xs cursor-pointer" />
                </Button>
              </Tooltip>
            </>
          )}
        </Space>
      }
    />
  );
};

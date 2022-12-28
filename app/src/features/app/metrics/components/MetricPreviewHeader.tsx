import { BarChartOutlined, ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons";
import { Space, Typography, Button, Tooltip } from "antd";
import { FormInstance } from "antd/es/form/Form";
import PageHeader from "core/components/PageHeader";
import api from "core/lib/api";
import { changeNavbarHiddenMode } from "features/app/state/navbar/actions";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { dispatch } from "store/store";
import { ApiResponse } from "types/api";
import { StoreState } from "types/store";
import { loadMetric } from "../state/actions";

interface Props {
  setCustomizeMode: (val: boolean) => void;
  isCustomizeMode: boolean;
  form: FormInstance;
}
export const MetricPreviewHeader: FC<Props> = ({
  setCustomizeMode,
  isCustomizeMode,
  form
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { metric } = useSelector((state: StoreState) => state.metrics);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const onSave = async () => {
    setSaveLoading(true);
    const payload = form.getFieldsValue();
    await api
      .patch<ApiResponse<string>>(`/api/metrics/${metric.config.id}/update`, payload)
      .then(() => {
        dispatch(loadMetric(id, metric.config.id));
      })
      .finally(() => {
        setSaveLoading(false);
        setCustomizeMode(false);
        dispatch(changeNavbarHiddenMode(false));
      });
  };

  const onDiscard = () => {
    setCustomizeMode(false);
    dispatch(changeNavbarHiddenMode(false));
  };

  const onCustomize = () => {
    setCustomizeMode(true);
    dispatch(changeNavbarHiddenMode(true));
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
                dispatch(changeNavbarHiddenMode(false));
              }}
            />
            <Typography.Text className="text-2xl">{metric?.config?.name}</Typography.Text>
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
              <Button type="primary" onClick={() => onCustomize()} ghost>
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

import { ExclamationCircleFilled } from "@ant-design/icons";
import { Space, Typography, Button } from "antd";
import { slugifyForUrl } from "../../../../core/utils/stringUtils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "../../../../types/store";
import api from "../../../../core/lib/api";
import { notify } from "../../../../core/utils/notify";
import { loadApplication } from "../../../../features/app/state/application/actions";
import { dispatch } from "../../../../store/store";
import { ApiResponse } from "../../../../types/api";
import { DataSourceConnStatus, CONNECTION_STATUS } from "../../../../types/tsdb";
import { loadMetrics } from "../state/actions";
import { useState } from "react";

export const ConnectionError = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const reloadMetrics = async () => {
    setLoading(true);
    await api
      .get<ApiResponse<DataSourceConnStatus>>("/api/influx/connection/check", {
        id: application.id
      })
      .then((resp) => {
        const status = resp.data.status;
        if (status === CONNECTION_STATUS.CONNECTED) {
          dispatch(loadMetrics());
        }

        dispatch(loadApplication());
      })
      .finally(() => setLoading(false));

    notify.success("Refreshed");
  };

  return (
    <Space className="w-full justify-center text-center pt-12" direction="vertical">
      <ExclamationCircleFilled className="text-5xl text-red-500" />
      <Typography.Text className="text-3xl font-bold">Connection Error</Typography.Text>
      <Typography.Paragraph>
        Please check your TSDB configuration to continue collecting metrics from your
        application.
      </Typography.Paragraph>
      <Typography.Paragraph className="pt-0">
        Click Reload button to check your connection health.
      </Typography.Paragraph>
      <Typography.Text className="text-xs">
        Reason: {application?.influxDS?.connError}
      </Typography.Text>
      <Space className="mt-5">
        <Button
          onClick={() =>
            navigate(
              `/app/${application.id}/${slugifyForUrl(
                application.name
              )}/settings/datasource`
            )
          }
          type="primary"
        >
          Settings
        </Button>
        <Button loading={loading} type="primary" ghost onClick={reloadMetrics}>
          Reload
        </Button>
      </Space>
    </Space>
  );
};

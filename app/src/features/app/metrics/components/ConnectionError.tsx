import { ExclamationCircleFilled } from "@ant-design/icons";
import { Space } from "core/ui-components/Space/Space";
import { slugifyForUrl } from "../../../../core/utils/stringUtils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "../../../../types/store";
import { notify } from "../../../../core/utils/notify";
import { useState } from "react";
import { metricsApi } from "../api";
import { Button } from "core/ui-components/Button/Button";
import { Typography } from "core/ui-components/Typography/Typography";

export const ConnectionError = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const reloadMetrics = async () => {
    await metricsApi.reload(application.id, setLoading);
    notify.success("Refreshed");
  };

  return (
    <Space className="w-full justify-center text-center pt-12" direction="vertical">
      <ExclamationCircleFilled className="text-5xl text-red-500" />
      <Typography size="xxl" weight="bold">
        Connection Error
      </Typography>
      <Typography className="pt-7">
        Please check your TSDB configuration to continue collecting metrics from your
        application.
      </Typography>
      <Typography className="pt-0">
        Click Reload button to check your connection health.
      </Typography>
      <Typography size="xs">Reason: {application?.influxDS?.connError}</Typography>
      <Space className="mt-7 w-full justify-center">
        <Button
          onClick={() =>
            navigate(
              `/app/${application.id}/${slugifyForUrl(
                application.name
              )}/settings/datasource`
            )
          }
          variant="primary"
        >
          Settings
        </Button>
        <Button loading={loading} variant="ghost" onClick={reloadMetrics}>
          Reload
        </Button>
      </Space>
    </Space>
  );
};

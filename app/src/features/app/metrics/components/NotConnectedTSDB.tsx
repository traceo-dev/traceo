import { DatabaseOutlined } from "@ant-design/icons";
import { Space } from "core/ui-components/Space";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "../../../../types/store";
import { Button } from "core/ui-components/Button";
import { Typography } from "core/ui-components/Typography";

export const NotConnectedTSDB = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const navigate = useNavigate();

  return (
    <Space className="w-full justify-center text-center py-12" direction="vertical">
      <DatabaseOutlined className="text-5xl" />
      <Typography size="xxl" weight="bold">
        Metrics are not available
      </Typography>
      <Typography>
        Configure a connection to the time series database to enable metrics collection.
      </Typography>
      <Space className="w-full justify-center">
        <Button
          onClick={() => navigate(`/app/${application.id}/settings/datasource`)}
          className="mt-5"
        >
          Configure
        </Button>
      </Space>
    </Space>
  );
};

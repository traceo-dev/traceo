import { DatabaseOutlined } from "@ant-design/icons";
import { Space, Button, Typography, Card } from "@traceo/ui";
import { useNavigate } from "react-router-dom";
import { useApplication } from "../../../../core/hooks/useApplication";

export const NotConnectedTSDB = () => {
  const { application } = useApplication();
  const navigate = useNavigate();

  return (
    <Card>
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
    </Card>
  );
};

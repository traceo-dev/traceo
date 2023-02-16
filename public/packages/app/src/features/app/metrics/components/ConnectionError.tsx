import { ExclamationCircleFilled } from "@ant-design/icons";
import { Space, Button, Typography, Card } from "@traceo/ui";
import { useNavigate } from "react-router-dom";
import { useApplication } from "../../../../core/hooks/useApplication";

export const ConnectionError = () => {
  const { application } = useApplication();
  const navigate = useNavigate();

  return (
    <Card>
      <Space className="w-full justify-center text-center py-12" direction="vertical">
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
        {/* <Typography size="xs">Reason: {application?.influxConfig?.connError}</Typography> */}
        <Space className="mt-7 gap-3 w-full justify-center">
          <Button
            onClick={() => navigate(`/app/${application.id}/settings/datasource`)}
            variant="primary"
          >
            Settings
          </Button>
          {/* <Button loading={loading} variant="ghost" onClick={reloadMetrics}>
            Reload
          </Button> */}
        </Space>
      </Space>
    </Card>
  );
};

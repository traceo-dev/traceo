import { ExclamationCircleFilled, SyncOutlined } from "@ant-design/icons";
import { Space, Typography, Button } from "antd";
import { slugifyForUrl } from "../../../../core/utils/stringUtils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "../../../../types/store";

export const ConnectionError = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const navigate = useNavigate();

  return (
    <Space className="w-full justify-center text-center pt-12" direction="vertical">
      <ExclamationCircleFilled className="text-5xl text-red-500" />
      <Typography.Text className="text-3xl font-bold">Connection Error</Typography.Text>
      <Typography.Paragraph>
        Please check your TSDB configuration to continue collecting metrics from your
        application.
      </Typography.Paragraph>
      <Typography.Paragraph className="pt-0">
        Click <SyncOutlined className="px-1" /> above to check to check your connection
        health.
      </Typography.Paragraph>
      <Typography.Text className="text-xs">
        Reason: {application?.influxDS?.connError}
      </Typography.Text>
      <Button
        onClick={() =>
          navigate(
            `/app/${application.id}/${slugifyForUrl(
              application.name
            )}/settings/datasource`
          )
        }
        className="mt-5"
        type="primary"
      >
        Check here
      </Button>
    </Space>
  );
};

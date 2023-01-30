import { LoadingOutlined } from "@ant-design/icons";
import { Space, Typography } from "@traceo/ui";

export const MetricLoading = () => (
  <Space direction="vertical" className="w-full items-center text-xs pb-5">
    <Typography>Please wait. It can take a while...</Typography>
    <LoadingOutlined />
  </Space>
);

import { LoadingOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";

export const MetricLoading = () => (
  <Space direction="vertical" className="w-full items-center text-xs pb-5">
    <Typography.Text>Please wait. It can take a while...</Typography.Text>
    <LoadingOutlined />
  </Space>
);

import { LoadingOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { Typography } from "core/ui-components/Typography/Typography";

export const MetricLoading = () => (
  <Space direction="vertical" className="w-full items-center text-xs pb-5">
    <Typography>Please wait. It can take a while...</Typography>
    <LoadingOutlined />
  </Space>
);

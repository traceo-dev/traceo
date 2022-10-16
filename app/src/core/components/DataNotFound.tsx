import { SearchOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";

export const DataNotFound = ({ label = "No data found", explanations = "" }) => (
  <Space direction="vertical" className="font-semibold w-full items-center pb-5 gap-0">
    <SearchOutlined className="text-2xl" />
    <Typography.Text>{label}</Typography.Text>
    {explanations && (
      <Typography.Text className="text-xs font-normal">{explanations}</Typography.Text>
    )}
  </Space>
);

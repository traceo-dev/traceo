import { BorderOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";

export const EmptyAppSearchList = () => {
  return (
    <>
      <Space direction="vertical">
        <BorderOutlined className="text-5xl text-cyan-700" />
        <Typography.Text className="text-3xl font-bold" strong>
          App not found
        </Typography.Text>
        <Typography.Text>
          Unfortunately, we did not find any apps in the given criteria, try again!
        </Typography.Text>
      </Space>
    </>
  );
};

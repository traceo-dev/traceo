import {} from "@ant-design/icons";
import { Space, Typography } from "antd";

export const EmptyIncidentCommentsList = () => {
  return (
    <>
      <Space direction="vertical">
        <Typography.Text className="text-2xl font-semibold" strong>
          No comments yet
        </Typography.Text>
        <Typography.Paragraph></Typography.Paragraph>
      </Space>
    </>
  );
};

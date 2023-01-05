import { LoadingOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { Button } from "core/ui-components/Button/Button";
import { useNavigate } from "react-router-dom";
import { PageCenter } from "./PageCenter";

export const TraceoLoading = () => {
  const navigate = useNavigate();

  return (
    <PageCenter>
      <Space direction="vertical" className="text-center">
        <Typography.Text>Loading...</Typography.Text>
        <LoadingOutlined />

        <Button onClick={() => navigate(-1)} className="mt-12" variant="ghost">
          Cancel and back
        </Button>
      </Space>
    </PageCenter>
  );
};

import { LoadingOutlined } from "@ant-design/icons";
import { Space, Button, Typography } from "@traceo/ui";
import { useNavigate } from "react-router-dom";
import { PageCenter } from "./PageCenter";

export const TraceoLoading = () => {
  const navigate = useNavigate();

  return (
    <PageCenter>
      <Space direction="vertical" className="text-center">
        <Typography>Loading...</Typography>
        <LoadingOutlined />

        <Button onClick={() => navigate(-1)} className="mt-12" variant="ghost">
          Cancel and back
        </Button>
      </Space>
    </PageCenter>
  );
};

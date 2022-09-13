import { Button, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { PageCenter } from "../../PageCenter";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <PageCenter>
      <Space direction="vertical" className="w-full gap-0 text-center">
        <Typography.Title className="text-9xl mb-0">404</Typography.Title>
        <Typography.Text>
          This page doesn&apos;t exist or you have no permission to be here.
        </Typography.Text>
        <Button type="primary" className="mt-12" onClick={() => navigate(-1)}>
          GO BACK
        </Button>
      </Space>
    </PageCenter>
  );
};

export default NotFound;

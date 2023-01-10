import { Space } from "antd";
import { Button } from "core/ui-components/Button/Button";
import { Typography } from "core/ui-components/Typography/Typography";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <Space direction="vertical" className="w-full gap-0 text-center">
        <Typography size="xxxl">404</Typography>
        <Typography>
          This page doesn&apos;t exist or you have no permission to be here.
        </Typography>
        <Button className="mt-12" onClick={() => navigate(-1)}>
          GO BACK
        </Button>
      </Space>
    </>
  );
};

export default NotFound;

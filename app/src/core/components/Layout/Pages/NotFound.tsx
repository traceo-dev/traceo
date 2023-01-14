import { Space } from "core/ui-components/Space";
import { Button } from "core/ui-components/Button";
import { Typography } from "core/ui-components/Typography";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Space direction="vertical" className="gap-0 text-center items-center">
      <Typography size="xxxl">404</Typography>
      <Typography className="pt-5">
        This page doesn&apos;t exist or you have no permission to be here.
      </Typography>
      <Button className="mt-12 max-w-min" onClick={() => navigate(-1)}>
        GO BACK
      </Button>
    </Space>
  );
};

export default NotFound;

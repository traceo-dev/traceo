import { Button } from "core/ui-components/Button";
import { Typography } from "core/ui-components/Typography";
import { useNavigate } from "react-router-dom";
import { useAccount } from "core/hooks/useAccount";
import { PageCenter } from "core/components/PageCenter";
import { Col } from "core/ui-components/Col";

const NotFound = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAccount();

  const onBack = () => {
    if (!isLoggedIn) {
      navigate("/");
    }

    navigate("/dashboard/overview");
  };

  return (
    <PageCenter>
      <Col className="text-center w-full items-center">
        <span className="text-[85px] font-bold">404</span>
        <Typography className="pt-2 text-[26px]">
          This page doesn&apos;t exist or you have no permission to be here.
        </Typography>
        <Button className="mt-12 max-w-min" onClick={() => onBack()}>
          GO BACK
        </Button>
      </Col>
    </PageCenter>
  );
};

export default NotFound;

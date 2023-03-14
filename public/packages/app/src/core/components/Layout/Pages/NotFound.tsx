import { useUser } from "../../../hooks/useUser";
import { PageCenter } from "../../PageCenter";
import { Button, Col, Typography } from "@traceo/ui";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  const onBack = () => {
    if (!isLoggedIn) {
      navigate("/");
    }

    navigate("/dashboard/applications");
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

import { Button, Space, Typography } from "antd";
import Link from "antd/lib/typography/Link";
import { useLayoutEffect, useState } from "react";
import api from "../../../core/lib/api";
import { ApiResponse } from "../../../types/api";
import { handleStatus } from "../../../core/utils/response";
import { notify } from "../../../core/utils/notify";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../core/hooks/useQuery";
import { LoadingOutlined } from "@ant-design/icons";

const ConfirmAccount = () => {
  const accountHash = useQuery("ac");
  const applicationId = useQuery("w");
  const navigate = useNavigate();
  const [status, setStatus] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    confirmAccount();
  }, []);

  const confirmAccount = async () => {
    setLoading(true);
    const query = {
      hash: accountHash,
      applicationId: null
    };

    applicationId ? (query.applicationId = applicationId) : null;

    const response: ApiResponse<string> = await api.get("/api/account/confirm", query);

    const isSuccess = handleStatus(response.status) === "success";
    isSuccess ? setStatus(true) : notify.error(response.message);

    setLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Space className="w-full justify-center">
          <LoadingOutlined />
        </Space>
      );
    }

    if (status) {
      return (
        <Space direction="vertical" className="w-full text-center px-0 py-3">
          <Typography.Text className="text-3xl" strong>
            You account has been activated!
          </Typography.Text>
          <Typography.Text className="text-xl">
            Log in to start using the application!
          </Typography.Text>
          <Button type="primary" className="mt-5" onClick={() => navigate("/login")}>
            Log In
          </Button>
        </Space>
      );
    }

    return (
      <Space direction="vertical" className="w-full text-center px-0 py-8">
        <Typography.Text className="text-xl" strong>
          Something went wrong!
        </Typography.Text>
        <Typography>
          Please go to back and sign in to your account or create a new one!
        </Typography>
        <Space direction="horizontal" className="w-full justify-center">
          <Link href={"/login"}>
            <Button>Log In</Button>
          </Link>
          <Link href={"/signup"}>
            <Button>Sign Up</Button>
          </Link>
        </Space>
      </Space>
    );
  };

  return (
    <>
      <div className="center-div">{renderContent()}</div>
    </>
  );
};

export default ConfirmAccount;

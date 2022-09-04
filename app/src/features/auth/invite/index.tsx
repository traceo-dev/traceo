import { Button, Space, Typography } from "antd";
import Link from "antd/lib/typography/Link";
import axios from "axios";
import { useLayoutEffect } from "react";
import { ApiResponse } from "src/types/api";
import { notify } from "src/core/utils/notify";
import { useQuery } from "src/core/hooks/useQuery";

const Invite = () => {
  const applicationId = useQuery<string>("w");
  const accountId = useQuery<string>("ac");

  useLayoutEffect(() => {
    assignToApplication();
  }, []);

  const assignToApplication = async () => {
    const response: ApiResponse<string> = await axios.get(
      "/api/awamrr/application/assign",
      {
        params: {
          appId: applicationId,
          aid: accountId
        }
      }
    );
    notify[response.status](response.data);
  };

  return (
    <>
      <div className="center-div">
        <Space direction="vertical" className="w-full text-center px-0 py-8">
          <Typography.Text className="text-medium" strong>
            New app! WooooHooooo!
          </Typography.Text>
          <Typography>
            You have been added to the new application. Log in to your account and start
            actively participating in it!
          </Typography>
          <Link href={"/login"}>
            <Button>Log In</Button>
          </Link>
        </Space>
      </div>
    </>
  );
};

export default Invite;

import AuthLayout from "src/core/components/Layout/AuthLayout";
import { useEffect, useState } from "react";
import { SignUpForm } from "./SignUpForm";
import { Button, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { notify } from "src/core/utils/notify";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";
import { signupAccount } from "src/features/auth/state/actions";
import { useQuery } from "src/core/hooks/useQuery";
import { dispatch } from "src/store/store";
import { clearState } from "../state/reducers";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const { isError, isSuccess } = useSelector((state: StoreState) => state.account);

  const appId = useQuery("w") as string;
  const navigate = useNavigate();
  const [showConfirmRegistration, setShowConfirmRegistration] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      setShowConfirmRegistration(true);
    }

    if (isError) {
      notify.error("Error. Please try again.");
      dispatch(clearState());
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  const onSubmit = async (form: SignupForm) => {
    setLoading(true);

    const payload = {
      appId: appId ?? null,
      ...form
    };
    dispatch(signupAccount(payload));

    setLoading(false);
  };

  const renderContent = () => {
    if (!showConfirmRegistration) {
      return (
        <AuthLayout title="Create your account 👋" subtitle="It's free and easy">
          <SignUpForm loading={loading} onFinish={onSubmit} />
        </AuthLayout>
      );
    }

    return (
      <div className="confirmationInfo">
        <Space direction="vertical" className="w-full text-center px-0 py-8">
          <Typography.Text className="text-3xl" strong>
            Thank you for creating an account!
          </Typography.Text>
          <Typography className="pt-3 px-12">
            An e-mail confirming the account creation has been sent to your e-mail
            address. Click on the link to complete the account creation process.
          </Typography>
          <Button onClick={() => navigate("/login")} type="primary" className="mt-5">
            Sign In
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <>
      <div className="w-full">
        <div className="float-left w-3/6 bg-primary h-screen"></div>
        <div className="float-right w-3/6">{renderContent()}</div>
      </div>
      <style>{`
        .confirmationInfo {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding-inline: 35px; 
        }
      `}</style>
    </>
  );
};

export default SignUp;

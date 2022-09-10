import AuthLayout from "src/core/components/Layout/AuthLayout";
import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { Form } from "antd";
import { notify } from "src/core/utils/notify";
import { useSelector } from "react-redux";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";
import { clearState } from "../state/reducers";
import { loginAccount } from "../state/actions";
import { LoginProps } from "src/types/auth";

const Login = () => {
  const { isError, isSuccess } = useSelector((state: StoreState) => state.account);
  const [loading, setLoading] = useState<boolean>(false);
  const [redirectToOverview, setRedirectToOverview] = useState<boolean>(true);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isError) {
      notify.error("Bad login or password");
      dispatch(clearState());
    }

    if (isSuccess) {
      window.location.href = "/dashboard/overview";
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  const onFinish = (credentials: LoginProps) => {
    if (!credentials.usernameOrEmail || !credentials.password) {
      return;
    }

    setLoading(true);
    dispatch(loginAccount(credentials));
    setLoading(false);
  };

  return (
    <>
      <div className="w-full">
        <AuthLayout title="Welcome to Traceo">
          <LoginForm form={form} loading={loading} onFinish={onFinish} />
        </AuthLayout>
      </div>
    </>
  );
};

export default Login;

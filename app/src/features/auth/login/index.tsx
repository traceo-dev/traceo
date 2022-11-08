import AuthLayout from "../../../core/components/Layout/AuthLayout";
import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { Form } from "antd";
import { notify } from "../../../core/utils/notify";
import { useSelector } from "react-redux";
import { dispatch } from "../../../store/store";
import { StoreState } from "../../../types/store";
import { clearState } from "../state/reducers";
import { loginAccount } from "../state/actions";
import { LoginProps } from "../../../types/auth";

const Login = () => {
  const { isError, isSuccess } = useSelector((state: StoreState) => state.account);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isError) {
      notify.error("Bad login or password");
      dispatch(clearState());
      setLoading(false);
    }

    if (isSuccess) {
      window.location.href = "/dashboard/overview";
      setLoading(false);
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  const onFinish = (credentials: LoginProps) => {
    if (!credentials.username || !credentials.password) {
      return;
    }

    setLoading(true);
    dispatch(loginAccount(credentials));
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

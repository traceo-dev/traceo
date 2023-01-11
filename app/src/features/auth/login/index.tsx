import AuthLayout from "../../../core/components/Layout/AuthLayout";
import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { useSelector } from "react-redux";
import { dispatch } from "../../../store/store";
import { StoreState } from "../../../types/store";
import { clearState } from "../state/reducers";
import { loginAccount } from "../state/actions";
import { LoginProps } from "../../../types/auth";

const Login = () => {
  const { isError, isSuccess } = useSelector((state: StoreState) => state.account);
  const [loading, setLoading] = useState<boolean>(false);
  const [invalid, setInvalid] = useState<boolean>(false);

  useEffect(() => {
    if (isError) {
      dispatch(clearState());
      setLoading(false);
      setInvalid(true);
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
          <LoginForm invalid={invalid} loading={loading} onFinish={onFinish} />
        </AuthLayout>
      </div>
    </>
  );
};

export default Login;

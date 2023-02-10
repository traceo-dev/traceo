import AuthLayout from "../../../core/components/Layout/AuthLayout";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { useAppDispatch } from "../../../store";
import { loadSignedInUser } from "../state/actions";
import { LoginProps, ApiResponse } from "@traceo/types";
import api from "../../../core/lib/api";

const Login = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [invalid, setInvalid] = useState<boolean>(false);

  const goToTraceo = () => {
    dispatch(loadSignedInUser());
    window.location.href = "/dashboard/overview";
  };

  const onFinish = async (credentials: LoginProps) => {
    if (!credentials.username || !credentials.password) {
      return;
    }

    setLoading(true);

    await api
      .post<ApiResponse<undefined>>("/api/auth/login", credentials)
      .then((res) => {
        if (res.status === "success") {
          goToTraceo();
        } else {
          setInvalid(true);
        }
      })
      .finally(() => setLoading(false));

    setLoading(false);
  };

  return (
    <AuthLayout title="Welcome to Traceo">
      <LoginForm invalid={invalid} loading={loading} onFinish={onFinish} />
    </AuthLayout>
  );
};

export default Login;

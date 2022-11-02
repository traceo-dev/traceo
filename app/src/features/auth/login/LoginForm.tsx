import { Button, Form, Input, Space } from "antd";
import { REQUIRED_FIELD_ERROR } from "../../../core/utils/constants";

export const LoginForm = ({ form, loading, onFinish }) => {
  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        name="login"
        className="pt-5"
        layout="vertical"
      >
        <Form.Item
          name="usernameOrEmail"
          label="Username or email"
          rules={[
            {
              required: true,
              warningOnly: true,
              message: REQUIRED_FIELD_ERROR
            }
          ]}
        >
          <Input className="auth-input" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          className="mt-8"
          rules={[
            {
              required: true,
              warningOnly: true,
              message: REQUIRED_FIELD_ERROR
            }
          ]}
        >
          <Input className="auth-input" type="password" />
        </Form.Item>

        <Space direction="vertical" className="mt-12 w-full">
          <Button
            size="large"
            htmlType="submit"
            className="w-full submit-button"
            loading={loading}
          >
            Log In
          </Button>
        </Space>
      </Form>
      <style>{`
        .auth-input {
          padding: 16px;
          background-color: var(--color-bg-primary) !important;
          font-size: 0.875rem !important;
          font-weight: 400;
          min-height: 55px;
          padding: 1rem !important;
          border-radius: 5px !important;
          line-height: inherit !important;
        }
      `}</style>
    </>
  );
};

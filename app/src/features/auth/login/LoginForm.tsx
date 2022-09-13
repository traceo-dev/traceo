import { Button, Form, Input, Space } from "antd";

export const LoginForm = ({ form, loading, onFinish }) => {
  return (
    <Form form={form} onFinish={onFinish} name="login" className="pt-5" layout="vertical">
      <Form.Item
        name="usernameOrEmail"
        label="Username or email"
        rules={[
          {
            required: true,
            warningOnly: true,
            message: "Please input username or email!"
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
            message: "Please input your Password!"
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
  );
};

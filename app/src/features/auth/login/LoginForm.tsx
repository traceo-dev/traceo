import { Button, Form, Input, Row, Space, Typography } from "antd";
import Link from "antd/lib/typography/Link";

export const LoginForm = ({ form, loading, onFinish }) => {
  return (
    <Form form={form} onFinish={onFinish} name="login" className="pt-5" layout="vertical">
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            warningOnly: true,
            message: "Please input your Email!"
          }
        ]}
      >
        <Input placeholder="Email" className="auth-input" />
      </Form.Item>

      <Form.Item
        name="password"
        className="mt-8"
        rules={[
          {
            required: true,
            warningOnly: true,
            message: "Please input your Password!"
          }
        ]}
      >
        <Input placeholder="Password" className="auth-input" type="password" />
      </Form.Item>

      <Row style={{ alignItems: "baseline", justifyContent: "end" }}>
        <Typography className="text-xs">Forgot password?</Typography>
      </Row>

      <Space direction="vertical" className="mt-12 w-full">
        <Button
          size="large"
          htmlType="submit"
          className="w-full submit-button"
          loading={loading}
        >
          Log In
        </Button>
        <Typography className="text-xs text-center mt-1">
          Don&apos;t have an account? <Link href={"/signup"}>Register now!</Link>
        </Typography>
      </Space>
    </Form>
  );
};

import { Button, Checkbox, Form, Input, Space, Typography } from "antd";
import Link from "antd/lib/typography/Link";

export const SignUpForm = ({ loading, onFinish }) => {
  return (
    <Form onFinish={onFinish} name="login" layout="vertical">
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            warningOnly: true,
            message: "Please input your Name!"
          }
        ]}
      >
        <Input autoComplete="false" placeholder="Name" className="auth-input" />
      </Form.Item>

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
        <Input autoComplete="false" placeholder="Email" className="auth-input" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            warningOnly: true,
            message: "Please input your Password!"
          }
        ]}
      >
        <Input
          autoComplete="false"
          placeholder="Password"
          className="auth-input"
          type="password"
        />
      </Form.Item>

      <Form.Item name="remember">
        <Checkbox value={true} defaultChecked>
          <Typography className="text-xs">
            By creating an account means you agree to the <b>Terms and Conditions</b>, and
            out <b>Privacy Policy</b>
          </Typography>
        </Checkbox>
      </Form.Item>

      <Space direction="vertical" className="mt-8 w-full">
        <Button loading={loading} htmlType="submit" className="submit-button w-full">
          Create Account
        </Button>
        <Typography className="text-xs text-center mt-1">
          Have an account? <Link href={"/login"}>Sign In!</Link>
        </Typography>
      </Space>
    </Form>
  );
};

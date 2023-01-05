import { Form, Space } from "antd";
import { Button } from "core/ui-components/Button/Button";
import { Input } from "core/ui-components/Input/Input";
import { InputSecret } from "core/ui-components/Input/InputSecret";
import { REQUIRED_FIELD_ERROR } from "../../../core/utils/constants";

export const LoginForm = ({ form, loading, onFinish }) => {
  return (
    <Form form={form} onFinish={onFinish} name="login" className="pt-5" layout="vertical">
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            warningOnly: true,
            message: REQUIRED_FIELD_ERROR
          }
        ]}
      >
        <Input />
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
        <InputSecret />
      </Form.Item>

      <Space direction="vertical" className="mt-12 w-full">
        <Button
          size="lg"
          type="submit"
          className="w-full justify-center text-xs"
          loading={loading}
        >
          Log In
        </Button>
      </Space>
    </Form>
  );
};

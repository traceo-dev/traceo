import { Button, Form, Input, Space, Typography } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useSelector } from "react-redux";
import api from "src/core/lib/api";
import { StoreState } from "src/types/store";
import { notify } from "src/core/utils/notify";

interface CheckCredentialsResponse {
  isCorrect: boolean;
}

export const ConfirmModalWithAuth = ({
  title = "",
  description,
  visible,
  onOk,
  onCancel
}) => {
  const { account } = useSelector((state: StoreState) => state.account);
  const [form] = Form.useForm();

  const confirm = async ({ password }: { password: string }) => {
    const auth: CheckCredentialsResponse = await api.post("/api/auth/check", {
      usernameOrEmail: account.email || account.username,
      password
    });

    if (!auth.isCorrect) {
      notify.error("Bad password!");
      return;
    }

    onOk();
    onCancel();
  };

  const submit = () => form.submit();

  return (
    <Modal
      visible={visible}
      title={title}
      closable={false}
      footer={
        <>
          <Button onClick={onCancel} type="default">
            Cancel
          </Button>
          <Button onClick={submit} type="primary">
            Confirm
          </Button>
        </>
      }
    >
      <Space className="w-full" direction="vertical">
        <Space className="w-full text-lg">{description}</Space>
        <Space className="w-full pt-5" direction="vertical">
          <Typography.Text>
            To perform this operation, please enter the password below and confirm.
          </Typography.Text>
          <Form form={form} onFinish={confirm}>
            <Form.Item className="pt-5" name="password" rules={[{ required: true }]}>
              <Input.Password placeholder="Password" />
            </Form.Item>
          </Form>
        </Space>
      </Space>
    </Modal>
  );
};

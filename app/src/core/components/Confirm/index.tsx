import { Form, Modal, Space, Typography } from "antd";
import api from "../../../core/lib/api";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { ApiResponse } from "../../../types/api";
import { StoreState } from "../../../types/store";
import { InputSecret } from "core/ui-components/Input/InputSecret";
import { Button } from "core/ui-components/Button/Button";

interface CheckCredentialsResponse {
  isCorrect: boolean;
}
interface Props {
  title?: string;
  description: string | JSX.Element;
  children: any;
  onOk: () => void;
  withAuth?: boolean;
}
export const Confirm: FC<Props> = ({
  title = "",
  description,
  children,
  onOk,
  withAuth = false
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { account } = useSelector((state: StoreState) => state.account);
  const [form] = Form.useForm();

  const submit = () => form.submit();

  const handleOk = () => {
    if (withAuth) {
      submit();
    } else {
      onOk();
      setOpen(false);
    }
  };

  const confirm = async ({ password }: { password: string }) => {
    const resp: ApiResponse<CheckCredentialsResponse> = await api.post(
      "/api/auth/check",
      {
        username: account.username,
        password
      }
    );

    if (resp.status === "error") {
      return;
    }

    onOk();
    setOpen(false);
  };

  return (
    <>
      <Space onClick={() => setOpen(true)}>{children}</Space>
      <Modal
        open={isOpen}
        title={title}
        closable={false}
        footer={
          <>
            <Button onClick={() => setOpen(false)} variant="ghost" className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleOk}>Confirm</Button>
          </>
        }
      >
        <Space className="w-full" direction="vertical">
          <Space className="w-full text-md">{description}</Space>
          {withAuth && (
            <Space className="w-full pt-5" direction="vertical">
              <Typography.Text>
                To perform this operation, please enter the password below and confirm.
              </Typography.Text>
              <Form form={form} onFinish={confirm}>
                <Form.Item className="pt-5" name="password" rules={[{ required: true }]}>
                  <InputSecret placeholder="Password" />
                </Form.Item>
              </Form>
            </Space>
          )}
        </Space>
      </Modal>
    </>
  );
};

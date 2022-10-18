import { Input, Space, Form, Modal } from "antd";
import { useState } from "react";
import { dispatch } from "../../../store/store";
import { addServerAccount } from "../../../features/management/state/accounts/actions";
import { AddAccountProps } from "../../../types/accounts";
import validators from "../../lib/validators";
import { REQUIRED_FIELD_ERROR } from "core/utils/constants";

export const NewAccountModal = ({ isOpen, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const submit = () => form.submit();

  const onFinish = (props: AddAccountProps) => {
    setLoading(true);
    dispatch(addServerAccount(props));
    setLoading(false);
    onClose();
  };

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <>
      <Modal
        title="New account"
        visible={isOpen}
        closable={false}
        onOk={submit}
        onCancel={onClose}
        confirmLoading={loading}
      >
        <Space
          direction="vertical"
          className="pt-0 px-4 w-full h-full justify-between text-center"
        >
          <Form onFinish={onFinish} form={form} layout="vertical">
            <Form.Item
              name="username"
              label="Username *"
              className="text-xs mb-5 font-semibold"
              requiredMark={"optional"}
              rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="name" label="Name" className="text-xs mb-5 font-semibold">
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email address"
              className="text-xs mb-5 font-semibold"
              rules={[{ required: false, ...validators.email }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password *"
              className="text-xs mb-5 font-semibold"
              requiredMark={"optional"}
              rules={[
                {
                  required: true,
                  message: REQUIRED_FIELD_ERROR,
                  ...validators.password
                }
              ]}
            >
              <Input.Password type="Password" />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </>
  );
};

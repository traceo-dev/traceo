import { Input, Space, Typography, Form, Drawer } from "antd";
import { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { DrawerButtons } from "../DrawerButtons";
import { dispatch } from "src/store/store";
import { addMember } from "src/features/app/members/state/actions";
import { addServerAccount } from "src/features/management/state/accounts/actions";
import { AddAccountProps } from "src/types/accounts";
import validators from "src/core/lib/validators";

export const NewAccountDrawer = ({ isOpen, onCancel }) => {
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
      <Drawer
        title="New account"
        onClose={onCancel}
        visible={isOpen}
        closable={false}
        footer={<DrawerButtons onClose={onClose} onFinish={submit} loading={loading} />}
      >
        <Space
          direction="vertical"
          className="pt-0 px-4 w-full h-full justify-between text-center"
        >
          <Form onFinish={onFinish} form={form} layout="vertical" className="pt-5">
            <Form.Item
              name="username"
              label="Username *"
              className="text-xs mb-5 font-semibold"
              requiredMark={"optional"}
              rules={[{ required: true, message: "This field is required" }]}
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
                  message: "This field is required",
                  ...validators.password
                }
              ]}
            >
              <Input.Password type="Password" />
            </Form.Item>
          </Form>
        </Space>
      </Drawer>
    </>
  );
};

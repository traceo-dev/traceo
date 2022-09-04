import { Input, Space, Form, Drawer } from "antd";
import { useState } from "react";
import { CreateApplicationProps } from "src/types/application";
import { DrawerButtons } from "../DrawerButtons";
import { dispatch } from "src/store/store";
import { createApplication } from "src/features/app/state/actions";

export const CreateApplicationDrawer = ({ isOpen, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const submit = () => form.submit();

  const onFinish = async (form: CreateApplicationProps) => {
    setLoading(true);
    dispatch(createApplication(form));
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
        title="New app"
        onClose={onCancel}
        visible={isOpen}
        size="default"
        closable={false}
        footer={<DrawerButtons onClose={onClose} onFinish={submit} loading={loading} />}
      >
        <Space direction="vertical" className="pt-0 px-4 w-full text-center">
          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              tooltip="Unique name for your app. This field is required."
              name="name"
              label="App name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Space>
      </Drawer>
    </>
  );
};

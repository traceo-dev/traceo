import { Input, Space, Typography, Form, Drawer } from "antd";
import { useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { DrawerButtons } from "../DrawerButtons";
import { dispatch } from "src/store/store";
import { addMember } from "src/features/app/members/state/actions";

export const AddMemberDrawer = ({ isOpen, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const submit = () => form.submit();

  const onFinish = async (form: { email: string }) => {
    setLoading(true);
    dispatch(addMember({ email: form.email }));
    setLoading(false);
    onCancel();
  };

  const onClose = () => {
    form.setFieldsValue({
      email: ""
    });
    onCancel();
  };

  return (
    <>
      <Drawer
        title="New member"
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
              name="email"
              label="Email address"
              className="text-xs mb-0 font-semibold"
              requiredMark={"optional"}
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Input />
            </Form.Item>
          </Form>
          <Typography.Paragraph className="text-xs">
            <QuestionCircleOutlined className="text-gray-600 pr-1" />
            Giving the appropriate permissions is possible only after the invitation has
            been approved and joined the application.
          </Typography.Paragraph>
        </Space>
      </Drawer>
    </>
  );
};

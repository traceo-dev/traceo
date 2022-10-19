import { Input, Space, Form, Modal } from "antd";
import { FC, useState } from "react";
import { CreateApplicationProps } from "../../../types/application";
import { dispatch } from "../../../store/store";
import { createApplication } from "../../../features/app/state/actions";
import { REQUIRED_FIELD_ERROR } from "core/utils/constants";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  isAdmin?: boolean;
}
export const CreateApplicationModal: FC<Props> = ({ isOpen, onCancel, isAdmin }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const submit = () => form.submit();

  const onFinish = (form: CreateApplicationProps) => {
    setLoading(true);
    dispatch(createApplication(form, isAdmin));
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
        title="New application"
        visible={isOpen}
        onCancel={onClose}
        onOk={submit}
        closable={false}
        confirmLoading={loading}
      >
        <Space direction="vertical" className="pt-0 px-4 w-full text-center">
          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </>
  );
};

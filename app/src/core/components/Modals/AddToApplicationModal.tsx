import { Space, Form, Select, Modal } from "antd";
import { FC, useState } from "react";
import { useApi } from "../../lib/useApi";
import {
  AddAccountToApplication,
  Application,
  MemberRole
} from "../../../types/application";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import api from "../../lib/api";
import { REQUIRED_FIELD_ERROR } from "../../../core/utils/constants";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  postExecute: () => void;
}
export const AddToApplicationModal: FC<Props> = ({ isOpen, onCancel, postExecute }) => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const { data: applications = [], isLoading } = useApi<Application[]>({
    url: "/api/application/all",
    params: {
      order: "DESC",
      sortBy: "createdAt"
    }
  });

  const submit = () => form.submit();

  const onFinish = async (props: AddAccountToApplication) => {
    setLoading(true);

    await api.post("/api/amr/application/add", { accountId: account.id, ...props });
    postExecute();

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
        title="Add to application"
        visible={isOpen}
        closable={false}
        onCancel={onCancel}
        onOk={submit}
        confirmLoading={loading}
      >
        <Space
          direction="vertical"
          className="pt-0 px-4 w-full h-full justify-between text-center"
        >
          <Form onFinish={onFinish} form={form} layout="vertical" className="pt-5">
            <Form.Item
              requiredMark={"optional"}
              rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
              name="applicationId"
              label="Application"
            >
              <Select loading={isLoading} placeholder="Select application">
                {applications?.map((val, index) => (
                  <Select.Option key={index} value={val.id}>
                    {val.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              requiredMark={"optional"}
              rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
              name="role"
              label="Role"
            >
              <Select placeholder="Select role">
                {Object.values(MemberRole).map((val, index) => (
                  <Select.Option key={index} value={val}>
                    {val}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </>
  );
};

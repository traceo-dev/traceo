import { Space, Form, Modal } from "antd";
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
import { Select } from "core/ui-components/Select/Select";

const roleOptions = Object.values(MemberRole).map((role) => ({
  label: role,
  value: role
}));

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
    await api
      .post("/api/amr/application/add", {
        accountId: account.id,
        applicationId: props.application.value,
        role: props.role.value
      })
      .finally(() => {
        postExecute();
        setLoading(false);
        onClose();
      });
  };

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <>
      <Modal
        title="Add to application"
        open={isOpen}
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
              name="application"
              label="Application"
            >
              <Select
                isLoading={isLoading}
                options={applications?.map((app) => ({
                  label: app.name,
                  value: app.id
                }))}
              />
            </Form.Item>
            <Form.Item
              requiredMark={"optional"}
              rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
              name="role"
              label="Role"
            >
              <Select options={roleOptions} />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </>
  );
};

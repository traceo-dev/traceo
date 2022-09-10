import { Space, Form, Drawer, Select } from "antd";
import { FC, useState } from "react";
import { DrawerButtons } from "../DrawerButtons";
import { AddAccountProps } from "src/types/accounts";
import { useApi } from "src/core/lib/useApi";
import {
  AddAccountToApplication,
  Application,
  MemberRole
} from "src/types/application";
import { addMember } from "src/features/app/members/state/actions";
import { dispatch } from "src/store/store";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";
import api from "src/core/lib/api";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  postExecute: () => void;
}
export const AddToApplicationDrawer: FC<Props> = ({ isOpen, onCancel, postExecute }) => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const { data: applications = [], isLoading } = useApi<Application[]>({
    url: "/api/application/all"
  });

  const submit = () => form.submit();

  const onFinish = async (props: AddAccountToApplication) => {
    console.log(props);

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
      <Drawer
        title="Add to an application"
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
              requiredMark={"optional"}
              rules={[{ required: true, message: "Select an application" }]}
              name="applicationId"
              label="Application *"
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
              rules={[{ required: true, message: "Role is required" }]}
              name="role"
              label="Role *"
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
      </Drawer>
    </>
  );
};

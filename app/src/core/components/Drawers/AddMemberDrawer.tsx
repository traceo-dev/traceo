import { Space, Typography, Form, Drawer, Select } from "antd";
import { useEffect, useState } from "react";
import { DrawerButtons } from "../DrawerButtons";
import { dispatch } from "store/store";
import { loadServerAccounts } from "features/management/state/accounts/actions";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";
import { Avatar } from "../Avatar";
import { ApplicationMember, MemberRole } from "types/application";
import api from "core/lib/api";
import { Account } from "types/accounts";

export const AddMemberDrawer = ({ isOpen, onCancel }) => {
  const { accounts, hasFetched } = useSelector(
    (state: StoreState) => state.serverAccounts
  );
  const { application } = useSelector((state: StoreState) => state.application);
  const { members } = useSelector((state: StoreState) => state.members);

  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const submit = () => form.submit();

  useEffect(() => {
    dispatch(loadServerAccounts());
  }, []);

  const onFinish = async (form: { accountId: string; role: MemberRole }) => {
    setLoading(true);

    await api.post("/api/amr/application/add", {
      accountId: form.accountId,
      role: form.role,
      applicationId: application.id
    });

    setLoading(false);
    onClose();
  };

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  const filterAccounts = () =>
    accounts.filter(
      (acc: Account) =>
        !members.find((mem: ApplicationMember) => mem.account.id === acc.id)
    );

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
              name="accountId"
              label="Server accounts"
              className="text-xs mb-0 font-semibold"
              requiredMark={"optional"}
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Select loading={!hasFetched}>
                {filterAccounts()?.map((val, index) => (
                  <Select.Option key={index} value={val.id}>
                    <Avatar name={val.name} url={val.gravatar} />
                    <Typography.Text className="ml-2">{val.name}</Typography.Text>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              requiredMark={"optional"}
              rules={[{ required: true, message: "Role is required" }]}
              name="role"
              label="Role"
              className="mt-5"
            >
              <Select>
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

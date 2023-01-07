import { Space, Form, Modal } from "antd";
import { useEffect, useState } from "react";
import { dispatch } from "../../../store/store";
import { loadServerAccounts } from "../../../features/management/state/accounts/actions";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { Avatar } from "../Avatar";
import { ApplicationMember, MemberRole } from "../../../types/application";
import api from "../../../core/lib/api";
import { Account } from "../../../types/accounts";
import { REQUIRED_FIELD_ERROR } from "../../../core/utils/constants";
import { Select } from "core/ui-components/Select/Select";

type FormType = {
  account: {
    value: string;
  };
  role: {
    value: MemberRole;
  };
};

export const AddMemberModal = ({ isOpen, onCancel }) => {
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

  const onFinish = async (form: FormType) => {
    setLoading(true);
    await api.post("/api/amr/application/add", {
      accountId: form.account.value,
      role: form.role.value,
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
        !members.find(({ account }: ApplicationMember) => account.id === acc.id)
    );

  const accountOptions = filterAccounts().map((account) => ({
    icon: <Avatar name={account.name} url={account.gravatar} />,
    label: account.name,
    value: account.id
  }));

  const roleOptions = Object.values(MemberRole).map((role) => ({
    label: role,
    value: role
  }));

  return (
    <>
      <Modal
        title="Add member"
        onCancel={onClose}
        open={isOpen}
        closable={false}
        confirmLoading={loading}
        onOk={submit}
      >
        <Space direction="vertical" className="w-full">
          <Form onFinish={onFinish} form={form} layout="vertical">
            <Form.Item
              name="account"
              label="Server account"
              requiredMark={"optional"}
              rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
            >
              <Select isLoading={!hasFetched} options={accountOptions} />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
              name="role"
              label="Role"
              requiredMark={"optional"}
            >
              <Select options={roleOptions} />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </>
  );
};

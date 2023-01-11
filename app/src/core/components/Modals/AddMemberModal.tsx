import { Modal } from "antd";
import { useEffect, useState, FormEvent } from "react";
import { dispatch } from "../../../store/store";
import { loadServerAccounts } from "../../../features/management/state/accounts/actions";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { ApplicationMember, MemberRole } from "../../../types/application";
import api from "../../../core/lib/api";
import { Account } from "../../../types/accounts";
import { Select } from "core/ui-components/Select/Select";
import { FormItem } from "core/ui-components/Form/FormItem";
import { Button } from "core/ui-components/Button/Button";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { Space } from "core/ui-components/Space/Space";
import { Avatar } from "core/ui-components/Avatar/Avatar";

export const AddMemberModal = ({ isOpen, onCancel }) => {
  const { accounts, hasFetched } = useSelector(
    (state: StoreState) => state.serverAccounts
  );
  const { application } = useSelector((state: StoreState) => state.application);
  const { members } = useSelector((state: StoreState) => state.members);

  const [role, setRole] = useState<MemberRole>(null);
  const [accountId, setAccountId] = useState<string>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(loadServerAccounts());
  }, []);

  const onFinish = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    await api
      .post("/api/amr/application/add", {
        accountId: accountId,
        role: role,
        applicationId: application.id
      })
      .finally(() => {
        setLoading(false);
        onClose();
      });
  };

  const onClose = () => {
    setAccountId(null);
    setRole(null);
    onCancel();
  };

  const filterAccounts = () =>
    accounts.filter(
      (acc: Account) =>
        !members.find(({ account }: ApplicationMember) => account.id === acc.id)
    );

  const accountOptions = filterAccounts().map((account) => ({
    icon: <Avatar size="sm" alt={account.name} src={account.gravatar} />,
    label: account.name,
    value: account.id,
    description: account?.email
  }));

  const roleOptions = Object.values(MemberRole).map((role) => ({
    label: role,
    value: role
  }));

  const onChangeRole = (role: MemberRole) => setRole(role);
  const onChangeAccount = (accountId: string) => setAccountId(accountId);

  return (
    <>
      <Modal
        title="Add member"
        onCancel={onClose}
        open={isOpen}
        closable={false}
        confirmLoading={loading}
        footer={null}
      >
        <Space direction="vertical" className="w-full">
          <form id="add-member-form" onSubmit={onFinish}>
            <FormItem label="Server account">
              <Select
                value={accountId}
                onChange={(opt) => onChangeAccount(opt?.value)}
                isLoading={!hasFetched}
                options={accountOptions}
              />
            </FormItem>
            <FormItem label="Role">
              <Select
                value={role}
                onChange={(opt) => onChangeRole(opt?.value)}
                options={roleOptions}
              />
            </FormItem>
          </form>

          <ButtonContainer className="float-left">
            <Button
              disabled={!role || !accountId}
              loading={loading}
              type="submit"
              form="add-member-form"
            >
              OK
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ButtonContainer>

          {/* <Form id="add-member-form" onSubmit={onFinish}>
            {({ register, errors }) => (
              <>
                <FormItem
                  label="Server account"
                  error={errors?.accountId}
                  required={true}
                >
                  <Select
                    {...register("accountId", {
                      required: true
                    })}
                    onChange={(opt) => onChangeAccount(opt?.value)}
                    isLoading={!hasFetched}
                    options={accountOptions}
                  />
                </FormItem>
                <FormItem label="Role" error={errors?.role} required={true}>
                  <Select
                    {...register("role", {
                      required: true
                    })}
                    onChange={(opt) => onChangeRole(opt?.value)}
                    options={roleOptions}
                  />
                </FormItem>
              </>
            )}
          </Form> */}
        </Space>
      </Modal>
    </>
  );
};

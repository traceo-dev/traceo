import { useEffect, useState, FormEvent } from "react";
import { useAppDispatch } from "../../../store";
import { loadServerAccounts } from "../../../features/management/state/accounts/actions";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { ApplicationMember, MemberRole } from "../../../types/application";
import api from "../../lib/api";
import { Account } from "../../../types/accounts";
import {
  Select,
  FormItem,
  Button,
  ButtonContainer,
  Space,
  Avatar,
  Modal
} from "@traceo/ui";
import { useApplication } from "../../hooks/useApplication";

export const AddMemberModal = ({ isOpen, onCancel }) => {
  const dispatch = useAppDispatch();

  const { accounts, hasFetched } = useSelector(
    (state: StoreState) => state.serverAccounts
  );
  const { application } = useApplication();
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
      (acc: Account) => !members.find((member: ApplicationMember) => member.id === acc.id)
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
      <Modal title="Add member" onCancel={onClose} open={isOpen}>
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
        </Space>
      </Modal>
    </>
  );
};

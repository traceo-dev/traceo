import { Space, Modal } from "antd";
import { useEffect, useState } from "react";
import { dispatch } from "../../../store/store";
import { loadServerAccounts } from "../../../features/management/state/accounts/actions";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { Avatar } from "../Avatar";
import { ApplicationMember, MemberRole } from "../../../types/application";
import api from "../../../core/lib/api";
import { Account } from "../../../types/accounts";
import { Select } from "core/ui-components/Select/Select";
import { Form } from "core/ui-components/Form/Form";
import { FormItem } from "core/ui-components/Form/FormItem";
import { Button } from "core/ui-components/Button/Button";

type FormType = {
  accountId: string;
  role: MemberRole;
};

export const AddMemberModal = ({ isOpen, onCancel }) => {
  const { accounts, hasFetched } = useSelector(
    (state: StoreState) => state.serverAccounts
  );
  const { application } = useSelector((state: StoreState) => state.application);
  const { members } = useSelector((state: StoreState) => state.members);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(loadServerAccounts());
  }, []);

  const onFinish = async (form: FormType) => {
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
      >
        <Space direction="vertical" className="w-full">
          <Form id="add-member-form" onSubmit={onFinish}>
            {({ register, setValue, errors }) => (
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
                    onChange={(opt) => setValue("accountId", opt?.value)}
                    isLoading={!hasFetched}
                    options={accountOptions}
                  />
                </FormItem>
                <FormItem label="Role" error={errors?.role} required={true}>
                  <Select
                    {...register("role", {
                      required: true
                    })}
                    onChange={(opt) => setValue("role", opt?.value)}
                    options={roleOptions}
                  />
                </FormItem>
              </>
            )}
          </Form>
          <Button type="submit" form="add-member-form">
            Submit
          </Button>
        </Space>
      </Modal>
    </>
  );
};

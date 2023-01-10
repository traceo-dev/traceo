import { Space, Alert } from "antd";
import { useSelector } from "react-redux";
import { Confirm } from "../../../../core/components/Confirm";
import {
  DescriptionInputRow,
  Descriptions
} from "../../../../core/components/Descriptions";
import { dispatch } from "../../../../store/store";
import { AccountStatus } from "../../../../types/accounts";
import { StoreState } from "../../../../types/store";
import { updateServerAccount } from "../../state/accounts/actions";
import api from "../../../../core/lib/api";
import { ApiResponse } from "../../../../types/api";
import { useNavigate } from "react-router-dom";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { Button } from "core/ui-components/Button/Button";
import { Typography } from "core/ui-components/Typography/Typography";
import { Card } from "core/ui-components/Card/Card";

export const AccountInformation = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const navigate = useNavigate();

  const onUpdateName = (newValue: string) =>
    dispatch(updateServerAccount({ id: account.id, name: newValue }));
  const onUpdateEmail = (newValue: string) =>
    dispatch(updateServerAccount({ id: account.id, email: newValue }));
  const onUpdateUsername = (newValue: string) =>
    dispatch(updateServerAccount({ id: account.id, username: newValue }));

  const isAdmin = account.email === ADMIN_EMAIL;

  const onChangeAccountStatus = () => {
    const status =
      account.status === AccountStatus.DISABLED
        ? AccountStatus.ACTIVE
        : AccountStatus.DISABLED;
    dispatch(updateServerAccount({ id: account.id, status }));
  };

  const onDeleteAccount = async () => {
    await api
      .delete<ApiResponse<unknown>>(`/api/account/${account.id}`)
      .then((response) => {
        if (response.status === "success") {
          navigate("/dashboard/management/accounts");
        }
      });
  };

  const OperationButtons = () => {
    const isDisableUserBtn = [AccountStatus.ACTIVE, AccountStatus.INACTIVE].includes(
      account.status
    );
    const isEnableUserBtn = AccountStatus.DISABLED === account.status;
    return (
      <Space className="w-full justify-end">
        {isDisableUserBtn && (
          <Confirm
            onOk={() => onChangeAccountStatus()}
            description={
              <Typography>
                Are you sure that you want to suspend <b>{account.name}</b>? After this
                action, user will not be able to log into the account.
              </Typography>
            }
          >
            <Button variant="ghost">Disable user</Button>
          </Confirm>
        )}

        {isEnableUserBtn && (
          <Confirm
            onOk={() => onChangeAccountStatus()}
            description={
              <Typography>
                Are you sure that you want to activate <b>{account.name}</b> account?
              </Typography>
            }
          >
            <Button variant="ghost">Enable user</Button>
          </Confirm>
        )}

        {!isAdmin && (
          <Confirm
            auth={true}
            description={"Are you sure that you want to delete this account?"}
            onOk={() => onDeleteAccount()}
          >
            <Button variant="danger">Delete account</Button>
          </Confirm>
        )}
      </Space>
    );
  };

  return (
    <>
      {isAdmin && (
        <Alert
          showIcon={true}
          type="warning"
          message="Administrator account is in read-only mode."
          className="mb-5"
        />
      )}

      <Card title="Personal Information" extra={<OperationButtons />}>
        <Descriptions>
          <DescriptionInputRow label="Name" onUpdate={onUpdateName} editable={!isAdmin}>
            {account.name}
          </DescriptionInputRow>
          <DescriptionInputRow
            label="Username"
            onUpdate={onUpdateUsername}
            editable={!isAdmin}
          >
            {account.username}
          </DescriptionInputRow>
          <DescriptionInputRow label="Email" onUpdate={onUpdateEmail} editable={!isAdmin}>
            {account.email}
          </DescriptionInputRow>
        </Descriptions>
      </Card>
    </>
  );
};

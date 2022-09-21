import { Space, Button, Typography, Alert } from "antd";
import { useSelector } from "react-redux";
import { Confirm } from "../../../../core/components/Confirm";
import {
  DescriptionInputRow,
  Descriptions
} from "../../../../core/components/Descriptions";
import PageHeader from "../../../../core/components/PageHeader";
import { dispatch } from "../../../../store/store";
import { AccountStatus } from "../../../../types/accounts";
import { StoreState } from "../../../../types/store";
import { updateServerAccount } from "../../state/accounts/actions";
import { DetailsSection } from "../../../../core/components/DetailsSection";
import api from "../../../../core/lib/api";
import { ApiResponse } from "../../../../types/api";
import { notify } from "../../../../core/utils/notify";
import { handleStatus } from "../../../../core/utils/response";
import { useNavigate } from "react-router-dom";

export const AccountInformation = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const navigate = useNavigate();

  const onUpdateName = (newValue: string) =>
    dispatch(updateServerAccount({ id: account.id, name: newValue }));
  const onUpdateEmail = (newValue: string) =>
    dispatch(updateServerAccount({ id: account.id, email: newValue }));
  const onUpdateUsername = (newValue: string) =>
    dispatch(updateServerAccount({ id: account.id, username: newValue }));

  const isAdmin = account.email === "admin@localhost";

  const onChangeAccountStatus = () => {
    const status =
      account.status === AccountStatus.DISABLED
        ? AccountStatus.ACTIVE
        : AccountStatus.DISABLED;
    dispatch(updateServerAccount({ id: account.id, status }));
  };

  const onDeleteAccount = async () => {
    try {
      const response: ApiResponse<string> = await api.delete(
        `/api/account/${account.id}`
      );
      if (handleStatus(response.status) === "success") {
        notify.success("Account successfully removed");
        navigate("/dashboard/management/accounts");
      } else {
        notify.error("Error. Please try again later.");
      }
    } catch (error) {
      notify.error(error);
    }
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
              <Typography.Text>
                Are you sure that you want to suspend <b>{account.name}</b>? After this
                action, user will not be able to log into the account.
              </Typography.Text>
            }
          >
            <Button type="primary" ghost>
              Disable user
            </Button>
          </Confirm>
        )}

        {isEnableUserBtn && (
          <Confirm
            onOk={() => onChangeAccountStatus()}
            description={
              <Typography.Text>
                Are you sure that you want to activate <b>{account.name}</b> account?
              </Typography.Text>
            }
          >
            <Button type="primary" ghost>
              Enable user
            </Button>
          </Confirm>
        )}

        {!isAdmin && (
          <Confirm
            withAuth={true}
            description={"Are you sure that you want to delete this account?"}
            onOk={() => onDeleteAccount()}
          >
            <Button type="primary" danger>
              Delete account
            </Button>
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
          message="The administrator account is only in read-only mode."
          className="mb-5"
        />
      )}

      <DetailsSection>
        <PageHeader
          fontSize={22}
          title="Personal information"
          subTitle="Basic informations about this user"
          className="pb-5"
          extra={<OperationButtons />}
        />

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
      </DetailsSection>
    </>
  );
};

import { Space, Button, Typography } from "antd";
import { useSelector } from "react-redux";
import { Confirm } from "src/core/components/Confirm";
import { DescriptionInputRow, Descriptions } from "src/core/components/Descriptions";
import PageHeader from "src/core/components/PageHeader";
import { dispatch } from "src/store/store";
import { AccountStatus } from "src/types/accounts";
import { StoreState } from "src/types/store";
import { updateServerAccount } from "../../state/accounts/actions";
import { DetailsSection } from "../../../../core/components/DetailsSection";

export const AccountInformation = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);

  const onUpdateName = (newValue: string) =>
    dispatch(updateServerAccount({ id: account.id, name: newValue }));
  const onUpdateEmail = (newValue: string) =>
    dispatch(updateServerAccount({ id: account.id, email: newValue }));
  const onUpdateUsername = (newValue: string) =>
    dispatch(updateServerAccount({ id: account.id, username: newValue }));

  const onChangeUserStatus = () => {
    const status =
      account.status === AccountStatus.DISABLED
        ? AccountStatus.ACTIVE
        : AccountStatus.DISABLED;
    dispatch(updateServerAccount({ id: account.id, status }));
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
            onOk={() => onChangeUserStatus()}
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
            onOk={() => onChangeUserStatus()}
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

        <Button type="primary" danger>
          Delete user
        </Button>
      </Space>
    );
  };

  return (
    <>
      <DetailsSection>
        <PageHeader
          fontSize={22}
          title="Personal information"
          subTitle="Basic informations about this user"
          className="pb-5"
          extra={<OperationButtons />}
        />

        <Descriptions>
          <DescriptionInputRow label="Name" onUpdate={onUpdateName}>
            {account.name}
          </DescriptionInputRow>
          <DescriptionInputRow label="Username" onUpdate={onUpdateUsername}>
            {account.username}
          </DescriptionInputRow>
          <DescriptionInputRow label="Email" onUpdate={onUpdateEmail}>
            {account.email}
          </DescriptionInputRow>
        </Descriptions>
      </DetailsSection>
    </>
  );
};

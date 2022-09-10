import {
  CheckCircleFilled,
  SafetyCertificateFilled
} from "@ant-design/icons";
import { Row, Space, Tooltip, Typography } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AccountStatusTag } from "src/core/components/AccountStatusTag";
import { Avatar } from "src/core/components/Avatar";
import { PaginatedTable } from "src/core/components/PaginatedTable";
import dateUtils from "src/core/utils/date";
import { Account, AccountStatus } from "src/types/accounts";
import { StoreState } from "src/types/store";

interface Props {
  accounts: Account[];
  hasFetched?: boolean;
}
export const AccountsTable: FC<Props> = ({ accounts, hasFetched }) => {
  const { account } = useSelector((state: StoreState) => state.account);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Login",
      render: (account: Account) => renderProfile(account)
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Last active",
      dataIndex: "lastActiveAt",
      render: (val: number) => dateUtils.fromNow(val)
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (role: AccountStatus) => <AccountStatusTag status={role} />
    }
  ];

  const renderProfile = (currentAccount: Account) => {
    return (
      <Row className="w-full items-center">
        <Avatar shape="circle" size="small" name={currentAccount?.username} />
        <Space>
          <Typography className="pl-2 text-primary">
            {currentAccount?.username}
          </Typography>
          {currentAccount.isAdmin && (
            <Tooltip title="Server admin">
              <SafetyCertificateFilled />
            </Tooltip>
          )}
          {currentAccount?.id === account?.id && (
            <Tooltip title="It's you!">
              <CheckCircleFilled className="p-1 text-amber-500" />
            </Tooltip>
          )}
        </Space>
      </Row>
    );
  };

  return (
    <>
      <PaginatedTable
        onRowClick={(account) => navigate(`/dashboard/management/users/${account.id}`)}
        loading={!hasFetched}
        columns={columns}
        pageSize={15}
        dataSource={accounts}
        className="cursor-pointer"
      />
    </>
  );
};

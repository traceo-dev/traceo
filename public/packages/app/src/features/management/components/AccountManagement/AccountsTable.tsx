import {
  CheckCircleFilled,
  LockFilled,
  SafetyCertificateFilled
} from "@ant-design/icons";
import { useAccount } from "../../../../core/hooks/useAccount";
import { Avatar, Space, Table, TableColumn, Tooltip, Typography } from "@traceo/ui";
import dateUtils from "../../../../core/utils/date";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { AccountStatusTag } from "../../../../core/components/AccountStatusTag";
import { IAccount, AccountStatus } from "@traceo/types";

interface Props {
  accounts: IAccount[];
  hasFetched?: boolean;
}
export const AccountsTable: FC<Props> = ({ accounts, hasFetched }) => {
  const account = useAccount();
  const navigate = useNavigate();

  const RenderProfile = (currentAccount: IAccount) => {
    return (
      <Space>
        <Typography className="text-primary">{currentAccount?.username}</Typography>
        {currentAccount?.id === account?.id && (
          <Tooltip placement="left" title="It's you!">
            <CheckCircleFilled className="p-1 text-amber-600" />
          </Tooltip>
        )}
        {currentAccount.isAdmin && (
          <Tooltip placement="top" title="Server admin">
            <SafetyCertificateFilled />
          </Tooltip>
        )}
        {currentAccount?.status === AccountStatus.DISABLED && (
          <Tooltip placement="top" title="Account disabled">
            <LockFilled />
          </Tooltip>
        )}
      </Space>
    );
  };

  return (
    <Table
      collection={accounts}
      striped
      loading={!hasFetched}
      onRowClick={({ id }) => navigate(`/dashboard/management/accounts/${id}`)}
      showPagination
      pageSize={15}
    >
      <TableColumn width={15}>
        {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.username} />}
      </TableColumn>
      <TableColumn name="Username">
        {({ item }) => <RenderProfile {...item} />}
      </TableColumn>
      <TableColumn name="Name" value="name" />
      <TableColumn name="Email" value="email" />
      <TableColumn name="Status">
        {({ item }) => <AccountStatusTag status={item.status} />}
      </TableColumn>
      <TableColumn name="Joined">
        {({ item }) => (
          <Tooltip
            placement="right"
            title={dateUtils.formatDate(item.createdAt, "HH:mm DD-MM-YYYY")}
          >
            <span>{dateUtils.fromNow(item.createdAt)}</span>
          </Tooltip>
        )}
      </TableColumn>
    </Table>
  );
};

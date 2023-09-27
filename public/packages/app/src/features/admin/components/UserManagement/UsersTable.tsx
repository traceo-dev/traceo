import { UserStatusTag } from "../../../../core/components/UserStatusTag";
import { useUser } from "../../../../core/hooks/useUser";
import dateUtils from "../../../../core/utils/date";
import { CheckCircleFilled, LockFilled, SafetyCertificateFilled } from "@ant-design/icons";
import { IUser, UserStatus } from "@traceo/types";
import { Avatar, Space, Table, TableColumn, Tooltip, Typography } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  users: IUser[];
  isLoading: boolean;
}
export const UsersTable: FC<Props> = ({ users, isLoading }) => {
  const user = useUser();
  const navigate = useNavigate();

  const RenderProfile = (u: IUser) => {
    return (
      <Space>
        <Typography className="text-primary">{u?.username}</Typography>
        {u?.id === user?.id && (
          <Tooltip placement="left" title="It's you!">
            <CheckCircleFilled className="p-1 text-amber-600" />
          </Tooltip>
        )}
        {u.admin && (
          <Tooltip placement="top" title="Server admin">
            <SafetyCertificateFilled />
          </Tooltip>
        )}
        {u?.status === UserStatus.DISABLED && (
          <Tooltip placement="top" title="Disabled">
            <LockFilled />
          </Tooltip>
        )}
      </Space>
    );
  };

  return (
    <Table
      collection={users}
      striped
      loading={isLoading}
      onRowClick={({ id }) => navigate(`/dashboard/admin/users/${id}`)}
      showPagination
      pageSize={15}
    >
      <TableColumn width={15}>
        {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.username} />}
      </TableColumn>
      <TableColumn name="Username">{({ item }) => <RenderProfile {...item} />}</TableColumn>
      <TableColumn name="Name" value="name" />
      <TableColumn name="Email" value="email" />
      <TableColumn name="Status">
        {({ item }) => <UserStatusTag status={item.status} />}
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

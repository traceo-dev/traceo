import dateUtils from "../../../../core/utils/date";
import { AlertOutlined, TeamOutlined } from "@ant-design/icons";
import { IProject } from "@traceo/types";
import { Avatar, Table, TableColumn } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  projects: IProject[];
  isLoading: boolean;
}
export const AdminProjectsTable: FC<Props> = ({ projects, isLoading }) => {
  const navigate = useNavigate();
  return (
    <Table
      collection={projects}
      loading={isLoading}
      onRowClick={(item) => navigate(`/dashboard/admin/apps/${item.id}`)}
      striped
      showPagination
    >
      <TableColumn width={15}>
        {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.name} />}
      </TableColumn>
      <TableColumn name="Name" value="name" />
      <TableColumn name="ID" value="id" />
      <TableColumn name="Last event">
        {({ item }) => dateUtils.fromNow(item?.lastEventAt)}
      </TableColumn>
      <TableColumn name="Incidents count">
        {({ item }) => (
          <span>
            <AlertOutlined className="pr-2" /> {item.incidentsCount}
          </span>
        )}
      </TableColumn>
      <TableColumn name="Members">
        {({ item }) => (
          <span>
            <TeamOutlined className="pr-2" /> {item.membersCount}
          </span>
        )}
      </TableColumn>
    </Table>
  );
};

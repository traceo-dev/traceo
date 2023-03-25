import dateUtils from "../../../../core/utils/date";
import { BugOutlined, TeamOutlined } from "@ant-design/icons";
import { IApplication } from "@traceo/types";
import { Avatar, Table, TableColumn } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  applications: IApplication[];
  hasFetched?: boolean;
}
export const ApplicationsTable: FC<Props> = ({ applications, hasFetched }) => {
  const navigate = useNavigate();
  return (
    <Table
      collection={applications}
      loading={!hasFetched}
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
            <BugOutlined className="pr-2" /> {item.incidentsCount}
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

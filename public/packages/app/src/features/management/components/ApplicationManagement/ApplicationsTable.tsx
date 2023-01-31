import { BugOutlined, TeamOutlined, WarningOutlined } from "@ant-design/icons";
import dateUtils from "../../../../core/utils/date";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Application } from "@traceo/types";
import { Avatar, Table, TableColumn } from "@traceo/ui";

interface Props {
  applications: Application[];
  hasFetched?: boolean;
}
export const ApplicationsTable: FC<Props> = ({ applications, hasFetched }) => {
  const navigate = useNavigate();
  return (
    <Table
      collection={applications}
      loading={!hasFetched}
      onRowClick={(item) => navigate(`/dashboard/management/apps/${item.id}`)}
      striped
      showPagination
    >
      <TableColumn width={15}>
        {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.name} />}
      </TableColumn>
      <TableColumn name="Name" value="name" />
      <TableColumn name="ID" value="id" />
      <TableColumn name="Last error">
        {({ item }) => dateUtils.fromNow(item?.lastIncidentAt)}
      </TableColumn>
      <TableColumn name="Incidents count">
        {({ item }) => (
          <span>
            <BugOutlined className="pr-2" /> {item.incidentsCount}
          </span>
        )}
      </TableColumn>
      <TableColumn name="Errors count">
        {({ item }) => (
          <span>
            <WarningOutlined className="pr-2" /> {item.errorsCount}
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

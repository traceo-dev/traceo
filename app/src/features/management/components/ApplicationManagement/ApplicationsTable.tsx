import { BugOutlined, TeamOutlined, WarningOutlined } from "@ant-design/icons";
import dateUtils from "../../../../core/utils/date";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Application } from "../../../../types/application";
import { Avatar } from "core/ui-components/Avatar";
import { Table } from "core/ui-components/Table";
import { TableColumn } from "core/ui-components/Table/TableColumn";

interface Props {
  applications: Application[];
  hasFetched?: boolean;
}
export const ApplicationsTable: FC<Props> = ({ applications }) => {
  const navigate = useNavigate();

  const columns = [
    {
      width: 50,
      render: (app: Application) => (
        <Avatar size="sm" alt={app.name} src={app?.gravatar} />
      )
    },
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "Last error",
      dataIndex: "lastIncidentAt",
      render: (val: number) => dateUtils.fromNow(val)
    },
    {
      title: "Incidents count",
      dataIndex: "incidentsCount",
      render: (val: number) => (
        <>
          <BugOutlined className="pr-2" /> {val}
        </>
      )
    },
    {
      title: "Errors count",
      dataIndex: "errorsCount",
      render: (val: number) => (
        <>
          <WarningOutlined className="pr-2" /> {val}
        </>
      )
    },
    {
      title: "Members",
      render: (app: Application) => (
        <>
          <TeamOutlined className="pr-2" /> {app.membersCount}
        </>
      )
    }
  ];

  return (
    // hasFetched
    <Table
      collection={applications}
      onRowClick={(item) => navigate(`/dashboard/management/apps/${item.id}`)}
      striped
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

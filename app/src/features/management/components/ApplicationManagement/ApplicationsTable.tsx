import { BugOutlined, TeamOutlined, WarningOutlined } from "@ant-design/icons";
import dateUtils from "core/utils/date";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../../../core/components/Avatar";
import { PaginatedTable } from "../../../../core/components/PaginatedTable";
import { Application } from "../../../../types/application";

interface Props {
  applications: Application[];
  hasFetched?: boolean;
}
export const ApplicationsTable: FC<Props> = ({ applications, hasFetched }) => {
  const navigate = useNavigate();

  const columns = [
    {
      width: 50,
      render: (app: Application) => <Avatar name={app.name} url={app?.gravatar} />
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
    <>
      <PaginatedTable
        onRowClick={(account) => navigate(`/dashboard/management/apps/${account.id}`)}
        loading={!hasFetched}
        columns={columns}
        pageSize={15}
        dataSource={applications}
        className="cursor-pointer"
      />
    </>
  );
};

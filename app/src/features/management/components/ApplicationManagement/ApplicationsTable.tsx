import { BugOutlined, TeamOutlined } from "@ant-design/icons";
import { Row, Typography } from "antd";
import { FC } from "react";
import { render } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Avatar } from "src/core/components/Avatar";
import { PaginatedTable } from "src/core/components/PaginatedTable";
import { Application } from "src/types/application";

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
      title: "Members",
      render: (app: Application) => (
        <Typography.Text>
          <TeamOutlined /> {app.membersCount}
        </Typography.Text>
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

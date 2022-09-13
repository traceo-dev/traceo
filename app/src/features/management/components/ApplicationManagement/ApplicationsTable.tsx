import { TeamOutlined } from "@ant-design/icons";
import { Typography } from "antd";
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

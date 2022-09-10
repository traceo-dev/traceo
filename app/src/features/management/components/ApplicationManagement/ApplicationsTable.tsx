import { Row, Typography } from "antd";
import { FC } from "react";
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
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "Name",
      render: (application: Application) => renderProfile(application)
    }
  ];

  const renderProfile = (application: Application) => {
    return (
      <Row className="w-full items-center">
        <Avatar shape="circle" size="small" name={application.name} />
        <Typography className="pl-2 text-primary">{application.name}</Typography>
      </Row>
    );
  };

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

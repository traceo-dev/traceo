import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";
import { AppIncidentsListPlot } from "../../../../core/components/Plots";
import { useApplication } from "../../../../core/hooks/useApplication";
import dateUtils from "../../../../core/utils/date";
import { wrapIncidentMessage } from "../../../../core/utils/stringUtils";
import { UserOutlined } from "@ant-design/icons";
import { IIncident } from "@traceo/types";
import { Typography, Space, Avatar, Table, TableColumn } from "@traceo/ui";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  incidents: IIncident[];
  isLoading: boolean;
}
export const IncidentTable: FC<Props> = ({ incidents, isLoading }) => {
  const navigate = useNavigate();
  const { application } = useApplication();

  const handleOnRowClick = (incident: IIncident) => {
    navigate(`/app/${application.id}/incidents/${incident.id}/details`);
  };

  return (
    <Table
      onRowClick={(item) => handleOnRowClick(item)}
      collection={incidents}
      rowSize="lg"
      showPagination
      hovered
      loading={isLoading}
    >
      <TableColumn width={600} name="Details">
        {({ item }) => <IncidentMainColumn incident={item} />}
      </TableColumn>
      <TableColumn name="Graph">
        {({ item }) => <AppIncidentsListPlot errors={item?.errorsDetails} />}
      </TableColumn>
      <TableColumn width={25} name="Errors" value="errorsCount" />
      <TableColumn width={25} name="Assigned">
        {({ item }) => (
          <Space className="w-full justify-center">
            {item?.assigned ? (
              <Avatar size="md" src={item?.assigned?.gravatar} alt={item?.assigned?.name} />
            ) : (
              <UserOutlined className="text-2xl" />
            )}
          </Space>
        )}
      </TableColumn>
    </Table>
  );
};

interface MainColumnProps {
  incident: IIncident;
}
const IncidentMainColumn: FC<MainColumnProps> = ({ incident }) => {
  const { application } = useApplication();
  return (
    <Link to={`/app/${application.id}/incidents/${incident.id}/details`}>
      <Space direction="vertical" className="gap-0">
        <Typography size="lg" weight="semibold">
          {incident?.type}
        </Typography>
        <Typography size="xs">{wrapIncidentMessage(incident?.message)}</Typography>
        <Space className="pt-2">
          <IncidentStatusTag status={incident?.status} className="mr-2" />
          <Typography size="xs" weight="semibold">
            Last: {dateUtils.fromNow(incident?.lastError)}
          </Typography>
        </Space>
      </Space>
    </Link>
  );
};

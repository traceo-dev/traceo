import { UserOutlined } from "@ant-design/icons";
import { FC } from "react";
import { IncidentsListPlot } from "../../../../core/components/Plots/components/IncidentsListPlot";
import { Incident } from "../../../../types/incidents";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { StoreState } from "../../../../types/store";
import { wrapIncidentMessage } from "../../../../core/utils/stringUtils";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";
import dateUtils from "../../../../core/utils/date";
import { Typography } from "core/ui-components/Typography";
import { Space } from "core/ui-components/Space";
import { Avatar } from "core/ui-components/Avatar";
import { Tooltip } from "core/ui-components/Tooltip";
import { Table } from "core/ui-components/Table";
import { TableColumn } from "core/ui-components/Table/TableColumn";

interface Props {
  incidents: Incident[];
  isLoading: boolean;
}
export const IncidentTable: FC<Props> = ({ incidents, isLoading }) => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.application);

  const handleOnRowClick = (incident: Incident) => {
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
        {({ item }) => <IncidentsListPlot errors={item?.errorsDetails} />}
      </TableColumn>
      <TableColumn width={25} name="Errors" value="errorsCount" />
      <TableColumn width={25} name="Assigned">
        {({ item }) => (
          <Space className="w-full justify-center">
            {item?.assigned ? (
              <Tooltip placement="top" title={item?.assigned?.name}>
                <Avatar
                  size="md"
                  src={item?.assigned?.gravatar}
                  alt={item?.assigned?.name}
                />
              </Tooltip>
            ) : (
              <Tooltip title="N/A">
                <UserOutlined className="text-2xl" />
              </Tooltip>
            )}
          </Space>
        )}
      </TableColumn>
    </Table>
  );
};

interface MainColumnProps {
  incident: Incident;
}
const IncidentMainColumn: FC<MainColumnProps> = ({ incident }) => {
  const { application } = useSelector((state: StoreState) => state.application);
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

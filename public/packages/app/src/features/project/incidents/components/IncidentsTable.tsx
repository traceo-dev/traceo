import { useProject } from "../../../../core/hooks/useProject";
import dateUtils from "../../../../core/utils/date";
import { UserOutlined } from "@ant-design/icons";
import { IIncident, IncidentStatus, mapIncidentStatus } from "@traceo/types";
import { Avatar, Table, TableColumn, Tooltip } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { mapHeaderStatusIcon, mapIncidentRgbColor, statusOptions } from "./utils";
import styled from "styled-components";
import { SdkIcon } from "../../../../core/components/SdkIcon";

interface Props {
  incidents: IIncident[];
  isLoading: boolean;
  onPageChange?: (page: number) => void;
  rowsCount?: number;
  page?: number;
}
export const IncidentsTable: FC<Props> = ({
  incidents,
  isLoading,
  onPageChange,
  rowsCount,
  page
}) => {
  const navigate = useNavigate();
  const { project } = useProject();

  const handleOnRowClick = (incident: IIncident) => {
    navigate(`/project/${project.id}/incidents/${incident.id}/details`);
  };

  return (
    <Table
      onRowClick={(item) => handleOnRowClick(item)}
      collection={incidents}
      showPagination
      striped
      loading={isLoading}
      rowSize="lg"
      onPageChange={onPageChange}
      pageSize={15}
      currentPage={page}
      rowsCount={rowsCount}
    >
      <TableColumn name="Details" width={600}>
        {({ item }) => <DetailsColumn {...item} />}
      </TableColumn>
      <TableColumn name="Status">
        {({ item }) => (
          <div>
            <span className="text-sm">{mapHeaderStatusIcon[item.status]}</span>
            <span className="pl-2 text-[12px]">{mapIncidentStatus[item.status]}</span>
          </div>
        )}
      </TableColumn>
      <TableColumn name="First seen">
        {({ item }) => (
          <Tooltip title={dateUtils.formatDate(item?.createdAt, "YYYY-MM-DD HH:mm")}>
            <span className="text-xs whitespace-nowrap">
              {dateUtils.fromNow(item?.createdAt)}
            </span>
          </Tooltip>
        )}
      </TableColumn>
      {/* <TableColumn name="Last seen">
        {({ item }) => (
          <Tooltip title={dateUtils.formatDate(item?.createdAt, "YYYY-MM-DD HH:mm")}>
            <span className="text-xs whitespace-nowrap">
              {dateUtils.fromNow(item?.lastEventAt)}
            </span>
          </Tooltip>
        )}
      </TableColumn> */}
      <TableColumn name="Events">
        {({ item }) => <span className="text-sm">{item?.eventsCount}</span>}
      </TableColumn>
      <TableColumn name="Assigned">
        {({ item }) =>
          item?.assigned ? (
            <Avatar size="sm" src={item?.assigned?.gravatar} alt={item?.assigned?.name} />
          ) : (
            <UserOutlined className="text-2xl" />
          )
        }
      </TableColumn>
    </Table>
  );
};

const DetailsWraper = styled.div<{ status: IncidentStatus }>`
  border-left: 5px solid ${(props) => mapIncidentRgbColor[props.status]};
  border-radius: 3px;
  padding-left: 12px;
  display: flex;
  flex-direction: column;
`;

const DetailsColumn = (incident: IIncident) => {
  const recentTrace = incident?.traces[0];

  return (
    <DetailsWraper status={incident.status}>
      <div className="flex flex-row gap-x-1 items-center">
        <SdkIcon sdk={incident.sdk} />
        <span className="font-semibold text-md pl-1">{incident.name}</span>
        <span className="text-secondary text-xs">in</span>
        <span className="text-xs">{recentTrace.filename}</span>
      </div>
      <span className="text-xs py-1">{incident.message}</span>
      <span className="text-xs text-secondary">
        Last seen {dateUtils.fromNow(incident?.lastEventAt)}
      </span>
    </DetailsWraper>
  );
};

import { useProject } from "../../../../core/hooks/useProject";
import dateUtils from "../../../../core/utils/date";
import { UserOutlined } from "@ant-design/icons";
import { IIncident, mapIncidentStatus } from "@traceo/types";
import { Avatar, Table, TableColumn, Tooltip } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { mapHeaderStatusIcon } from "./utils";
import styled from "styled-components";

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
        {({ item }) => (
          <div className="flex flex-col leading-5">
            <span className="font-semibold">{item.name}</span>
            <span className="text-[12px] truncate xl:max-w-[400px] md:max-w-[200px]">
              {item?.message}
            </span>
          </div>
        )}
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
      <TableColumn name="Last seen">
        {({ item }) => (
          <Tooltip title={dateUtils.formatDate(item?.createdAt, "YYYY-MM-DD HH:mm")}>
            <span className="text-xs whitespace-nowrap">
              {dateUtils.fromNow(item?.lastEventAt)}
            </span>
          </Tooltip>
        )}
      </TableColumn>
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

const NewIncidentPill = styled.div`
  display: inline-flex;
  align-items: center;
  height: 20px;
  border-radius: 20px;
  border: 1px solid var(--color-traceo-primary);
  padding: 0px 8px;
`;

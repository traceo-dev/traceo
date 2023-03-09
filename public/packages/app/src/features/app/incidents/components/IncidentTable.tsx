import { useApplication } from "../../../../core/hooks/useApplication";
import dateUtils from "../../../../core/utils/date";
import { UserOutlined } from "@ant-design/icons";
import { IIncident, IncidentStatus, mapIncidentStatus } from "@traceo/types";
import { Typography, Space, Avatar, Table, TableColumn, Tooltip } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { conditionClass, joinClasses } from "../../../../core/utils/classes";
import { mapHeaderStatusIcon } from "./utils";
import IncidentsListChart from "../../../../core/components/Charts/Incidents/IncidentsListChart";

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
      showPagination
      hovered
      loading={isLoading}
    >
      <TableColumn name="Details" width={700}>
        {({ item }) => (
          <Space direction="vertical" className="gap-0">
            <div className="flex flex-row items-center">
              <Tooltip title={mapIncidentStatus[item.status]}>
                {mapHeaderStatusIcon[item.status]}
              </Tooltip>

              <div className="flex flex-col pl-5">
                <Typography
                  size="lg"
                  weight="semibold"
                  className={joinClasses(
                    conditionClass(item.status === IncidentStatus.RESOLVED, "line-through")
                  )}
                >
                  {item?.type}
                </Typography>
                <span className="pt-2 truncate text-xs text-primary xl:max-w-[400px] md:max-w-[200px]">
                  {item?.message}
                </span>
              </div>
            </div>
          </Space>
        )}
      </TableColumn>
      <TableColumn name="Graph" width={300}>
        {({ item }) => (
          // TODO: echarts chart is very bad when we want to resize him...
          <div style={{ width: 200 }}>
            <IncidentsListChart errors={item?.errorsDetails} />
          </div>
        )}
      </TableColumn>
      <TableColumn name="Errors">
        {({ item }) => <span className="text-xs">{item?.errorsCount}</span>}
      </TableColumn>
      <TableColumn name="Last error">
        {({ item }) => (
          <span className="text-xs whitespace-nowrap">{dateUtils.fromNow(item?.lastError)}</span>
        )}
      </TableColumn>
      <TableColumn name="Assigned">
        {({ item }) =>
          item?.assigned ? (
            <Avatar size="md" src={item?.assigned?.gravatar} alt={item?.assigned?.name} />
          ) : (
            <UserOutlined className="text-2xl" />
          )
        }
      </TableColumn>
    </Table>
  );
};

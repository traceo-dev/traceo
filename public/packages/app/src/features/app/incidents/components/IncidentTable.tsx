import { useApplication } from "../../../../core/hooks/useApplication";
import dateUtils from "../../../../core/utils/date";
import { RightOutlined, UserOutlined } from "@ant-design/icons";
import { IIncident, IncidentStatus, mapIncidentStatus } from "@traceo/types";
import { Space, Avatar, Table, TableColumn } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { mapHeaderStatusIcon } from "./utils";
import IncidentsListChart from "../../../../core/components/Charts/Incidents/IncidentsListChart";
import styled from "styled-components";
import dayjs from "dayjs";

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

  const isNewIncident = (inc: IIncident): boolean => {
    if (inc.status !== IncidentStatus.UNRESOLVED) {
      return false;
    }
    // New incident created within last 2 hours
    return dayjs.unix(inc.createdAt).add(2, "h").isAfter(dayjs());
  };

  return (
    <Table
      onRowClick={(item) => handleOnRowClick(item)}
      collection={incidents}
      showPagination
      loading={isLoading}
      rowSize="lg"
    >
      <TableColumn name="Details" width={700}>
        {({ item }) => (
          <Space direction="vertical" className="gap-0">
            <div className="w-full flex flex-row gap-x-3 items-center">
              <span className="text-[16px] leading-3 font-semibold hover:text-white">
                {item?.type}
              </span>
              {isNewIncident(item) && (
                <NewIncidentPill>
                  <span className="text-yellow-500 text-[10px]">New incident</span>
                </NewIncidentPill>
              )}
            </div>

            <span className="flex flex-row text-xs text-primary items-center">
              <div>
                <span className="text-sm">{mapHeaderStatusIcon[item.status]}</span>
                <span className="pl-2 text-[12px]">{mapIncidentStatus[item.status]}</span>
              </div>
              <RightOutlined className="text-[8px] px-2" />
              <span className="text-[12px] truncate xl:max-w-[400px] md:max-w-[200px]">{item?.message}</span>
            </span>
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

const NewIncidentPill = styled.div`
  display: inline-flex;
  align-items: center;
  height: 20px;
  border-radius: 20px;
  border: 1px solid var(--color-traceo-primary);
  padding: 0px 8px;
`;

import {
  LoadingOutlined,
  MessageOutlined,
  UserOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { ColumnsType, TableProps } from "antd/lib/table";
import { FC } from "react";
import { Table } from "antd";
import { IncidentsListPlot } from "../../../../core/components/Plots/components/IncidentsListPlot";
import { Incident } from "../../../../types/incidents";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "../../../../types/store";
import { slugifyForUrl, wrapIncidentMessage } from "../../../../core/utils/stringUtils";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";
import dateUtils from "../../../../core/utils/date";
import { Typography } from "core/ui-components/Typography/Typography";
import { Space } from "core/ui-components/Space/Space";
import { Avatar } from "core/ui-components/Avatar/Avatar";

interface Props {
  incidents: Incident[];
  isLoading: boolean;
}
export const IncidentTable: FC<Props> = ({ incidents, isLoading }) => {
  const { application } = useSelector((state: StoreState) => state.application);
  const navigate = useNavigate();

  const openIncident = (incidentId: string) => {
    navigate(
      `/app/${application.id}/${slugifyForUrl(
        application.name
      )}/incidents/${incidentId}/details`
    );
  };

  const columns: ColumnsType<Incident> = [
    {
      title: "Details",
      width: 750,
      render: (record: Incident) => <IncidentMainColumn incident={record} />
    },
    {
      width: 150,
      title: "Graph",
      render: (record: Incident) => <IncidentsListPlot errors={record?.errorsDetails} />
    },
    {
      width: 100,
      title: "Assigned",
      render: (record: Incident) => (
        <Space className="w-full justify-center">
          {record?.assigned ? (
            <Tooltip placement="bottom" title={record?.assigned?.name}>
              <Space>
                <Avatar
                  size="md"
                  src={record?.assigned?.gravatar}
                  alt={record?.assigned?.name}
                />
              </Space>
            </Tooltip>
          ) : (
            <>
              <Tooltip placement="bottom" title="Not assigned">
                <UserOutlined className="text-2xl" />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  const tableConfig: Partial<TableProps<any>> = {
    id: "incidentsTable",
    className: "cursor-pointer",
    rowKey: "id",
    loading: {
      spinning: isLoading,
      indicator: <LoadingOutlined className="text-white" />
    },
    onRow: (record) => {
      return {
        onClick: () => {
          openIncident(record.id);
        }
      };
    },
    dataSource: incidents,
    columns,
    pagination: {
      defaultPageSize: 15,
      total: incidents?.length,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 15]
    }
  };

  return (
    <>
      <Table {...tableConfig} />
      <style>{`
        .ant-table-tbody > tr.ant-table-row:hover > td {
          background: none !important;
        }
    `}</style>
    </>
  );
};

interface MainColumnProps {
  incident: Incident;
}
const IncidentMainColumn: FC<MainColumnProps> = ({ incident }) => {
  return (
    <Space direction="vertical" className="gap-0">
      <Typography size="lg" weight="semibold" className="text-primary">
        {incident?.type}
      </Typography>
      <Typography size="xs">{wrapIncidentMessage(incident?.message)}</Typography>
      <Space className="pt-2">
        <IncidentStatusTag status={incident?.status} className="mr-2" />
        <Typography size="xs" weight="semibold" className="text-primary pipe">
          Last: {dateUtils.fromNow(incident?.lastError)}
        </Typography>
        <Tooltip title="Errors count">
          <Typography size="xs" weight="semibold" className="text-primary pipe">
            <WarningOutlined className="pr-2" />
            {incident?.errorsCount}
          </Typography>
        </Tooltip>
        <Tooltip title="Comments count">
          <Typography size="xs" weight="semibold" className="text-primary">
            <MessageOutlined className="pr-2" />
            {incident?.commentsCount || 0}
          </Typography>
        </Tooltip>
      </Space>
    </Space>
  );
};

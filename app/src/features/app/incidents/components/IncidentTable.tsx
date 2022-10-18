import {
  BugOutlined,
  LoadingOutlined,
  MessageOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Space, Tooltip, Typography } from "antd";
import { ColumnsType, TableProps } from "antd/lib/table";
import { FC } from "react";
import { Table } from "antd";
import { IncidentsListPlot } from "../../../../core/components/Plots/components/IncidentsListPlot";
import { Incident } from "../../../../types/incidents";
import { Avatar } from "../../../../core/components/Avatar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "../../../../types/store";
import { slugifyForUrl, wrapIncidentMessage } from "../../../../core/utils/stringUtils";
import { IncidentStatusTag } from "core/components/IncidentStatusTag";
import { joinClasses } from "core/utils/classes";
import dateUtils from "core/utils/date";

interface Props {
  incidents: Incident[];
  isLoading: boolean;
  selectedIncidents?: string[];
  setSelectedIncidents?: (incidents: string[]) => void;
}
export const IncidentTable: FC<Props> = ({
  incidents,
  isLoading,
  selectedIncidents,
  setSelectedIncidents
}) => {
  const { application } = useSelector((state: StoreState) => state.application);
  const navigate = useNavigate();

  const openIncident = (incidentId: string) => {
    navigate(
      `/app/${application.id}/${slugifyForUrl(
        application.name
      )}/incidents/${incidentId}/details`
    );
  };

  const handleRowSelect = (incidents: string[]) =>
    setSelectedIncidents && setSelectedIncidents(incidents);

  const columns: ColumnsType<Incident> = [
    {
      title: "Details",
      width: 750,
      render: (record: Incident) => <IncidentMainColumn incident={record} />
    },
    {
      width: 150,
      title: "Graph",
      render: (record: Incident) => <IncidentsListPlot errors={record?.occurDates} />
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
                  shape="circle"
                  size="large"
                  url={record?.assigned?.logo}
                  name={record?.assigned?.name}
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
    rowSelection: {
      onChange: (selectedRowKeys: any[]) => handleRowSelect(selectedRowKeys),
      selectedRowKeys: selectedIncidents,
      hideSelectAll: true
    },
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
      <Typography.Link
        className={joinClasses("font-semibold", "text-lg", "text-primary")}
      >
        {incident?.type}
      </Typography.Link>
      <Typography className="text-xs">
        {wrapIncidentMessage(incident?.message)}
      </Typography>
      <Space className="pt-2">
        <IncidentStatusTag status={incident?.status} />|
        <Typography className="text-xs font-semibold text-primary">
          Last: {dateUtils.fromNow(incident?.lastOccur)}
        </Typography>
        |
        <Typography className="text-xs font-semibold text-primary">
          <BugOutlined className="pr-3" />
          {incident?.occuredCount}
        </Typography>
        |
        <Typography className="text-xs font-semibold text-primary">
          <MessageOutlined className="pr-3" />
          {incident?.commentsCount || 0}
        </Typography>
      </Space>
    </Space>
  );
};

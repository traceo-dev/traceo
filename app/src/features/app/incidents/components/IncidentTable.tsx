import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { ColumnsType, TableProps } from "antd/lib/table";
import { FC } from "react";
import { Table } from "antd";
import { IncidentsListPlot } from "../../../../core/components/Plots/components/IncidentsListPlot";
import { Incident } from "../../../../types/incidents";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { StoreState } from "../../../../types/store";
import { wrapIncidentMessage } from "../../../../core/utils/stringUtils";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";
import dateUtils from "../../../../core/utils/date";
import { Typography } from "core/ui-components/Typography";
import { Space } from "core/ui-components/Space";
import { Avatar } from "core/ui-components/Avatar";
import { Tooltip } from "core/ui-components/Tooltip";

interface Props {
  incidents: Incident[];
  isLoading: boolean;
}
export const IncidentTable: FC<Props> = ({ incidents, isLoading }) => {
  const columns: ColumnsType<Incident> = [
    {
      title: "Details",
      width: 650,
      render: (record: Incident) => <IncidentMainColumn incident={record} />
    },
    {
      width: 150,
      title: "Graph",
      render: (record: Incident) => <IncidentsListPlot errors={record?.errorsDetails} />
    },
    {
      width: 100,
      title: "Errors",
      className: "text-end",
      render: (record: Incident) => (
        <Typography size="lg">{record?.errorsCount}</Typography>
      )
    },
    {
      width: 100,
      title: "Assigned",
      render: (record: Incident) => (
        <Space className="w-full justify-center">
          {record?.assigned ? (
            <Tooltip placement="top" title={record?.assigned?.name}>
              <Avatar
                size="md"
                src={record?.assigned?.gravatar}
                alt={record?.assigned?.name}
              />
            </Tooltip>
          ) : (
            <Tooltip title="N/A">
              <UserOutlined className="text-2xl" />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const tableConfig: Partial<TableProps<any>> = {
    id: "incidentsTable",
    rowKey: "id",
    loading: {
      spinning: isLoading,
      indicator: <LoadingOutlined className="text-white" />
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

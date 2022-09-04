import { UserOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import { ColumnsType, TableProps } from "antd/lib/table";
import { FC } from "react";
import { Table } from "antd";
import { IncidentsListPlot } from "src/core/components/Plots/components/IncidentsListPlot";
import { Incident } from "src/types/incidents";
import { Avatar } from "../../../../core/components/Avatar";
import { IncidentMainColumn } from "./IncidentMainColumn";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "src/types/store";
import { slugifyForUrl } from "src/core/utils/stringUtils";

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

  const handleRowSelect = (incidents: string[]) => {
    setSelectedIncidents(incidents);
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
    loading: isLoading,
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
      onChange: (selectedRowKeys: any[]) => {
        handleRowSelect(selectedRowKeys);
      },
      selectedRowKeys: selectedIncidents
    },
    pagination: {
      defaultPageSize: 15,
      total: incidents?.length,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 15]
    }
  };

  return <Table {...tableConfig} />;
};

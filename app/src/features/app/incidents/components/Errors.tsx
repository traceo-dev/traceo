import { Badge, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Card } from "core/ui-components/Card";
import { Typography } from "core/ui-components/Typography";
import { useSelector } from "react-redux";
import dateUtils from "../../../../core/utils/date";
import { ErrorDetails } from "../../../../types/incidents";
import { StoreState } from "../../../../types/store";

interface ErrorDetailsTable extends ErrorDetails {
  number?: string;
}

export const Errors = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  const columns: ColumnsType<ErrorDetailsTable> = [
    {
      title: "Time",
      render: (record: ErrorDetails) =>
        dateUtils.formatDate(record?.date, "DD MMM YYYY HH:mm")
    }
  ];

  return (
    <Card
      title={
        <Typography>
          Errors <Badge count={incident?.errorsDetails?.length} />
        </Typography>
      }
      className="h-min"
    >
      <Table
        pagination={{ pageSize: 150 }}
        scroll={{ y: 440 }}
        dataSource={incident?.errorsDetails}
        columns={columns}
      />
    </Card>
  );
};

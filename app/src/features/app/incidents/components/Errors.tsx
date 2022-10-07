import { Badge, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useSelector } from "react-redux";
import { CollapsedDetails } from "../../../../core/components/CollapsedDetails";
import { PagePanel } from "../../../../core/components/PagePanel";
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
    <PagePanel>
      <CollapsedDetails
        label={
          <Typography>
            Errors <Badge count={incident?.occurDates.length} />
          </Typography>
        }
      >
        <Table dataSource={incident?.occurDates} columns={columns} />
      </CollapsedDetails>
    </PagePanel>
  );
};

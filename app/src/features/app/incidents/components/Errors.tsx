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
      title: "Error number",
      dataIndex: "number"
    },
    {
      title: "Time",
      render: (record: ErrorDetails) =>
        dateUtils.formatDate(record?.date, "DD MMM YYYY HH:mm")
    }
    // {
    //   title: "Release",
    //   render: (record: ErrorDetails) => (
    //     <Typography.Link
    //       className="font-semibold"
    //       onClick={() =>
    //         navigate(`/app/${application?.id}/releases/${incident?.release?.id}/details`)
    //       }
    //     >
    //       {record?.version?.name}
    //     </Typography.Link>
    //   )
    // }
  ];

  const data = () => {
    const errors = [...incident?.occurDates];
    return errors
      .map<ErrorDetailsTable>((error, index) => ({ ...error, number: `#${index + 1}` }))
      .sort((a, b) => b.date - a.date);
  };

  return (
    <PagePanel>
      <CollapsedDetails
        label={
          <Typography>
            Errors <Badge count={incident?.occurDates.length} />
          </Typography>
        }
      >
        <Table dataSource={data()} columns={columns} />
      </CollapsedDetails>
    </PagePanel>
  );
};

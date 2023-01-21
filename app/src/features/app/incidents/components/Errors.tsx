import { Badge } from "core/ui-components/Badge";
import { Card } from "core/ui-components/Card";
import { Table } from "core/ui-components/Table";
import { TableColumn } from "core/ui-components/Table/TableColumn";
import { Typography } from "core/ui-components/Typography";
import { useSelector } from "react-redux";
import dateUtils from "../../../../core/utils/date";
import { StoreState } from "../../../../types/store";

export const Errors = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <Card
      title={
        <div className="flex flex-row">
          <Typography>Errors</Typography>
          <Badge className="ml-2" count={incident?.errorsDetails?.length} />
        </div>
      }
      className="h-max"
    >
      <div className="h-64 overflow-y-scroll">
        <Table collection={incident?.errorsDetails} hovered>
          <TableColumn name="Time" className="py-5">
            {({ item }) => dateUtils.formatDate(item?.date, "DD MMM YYYY HH:mm")}
          </TableColumn>
        </Table>
      </div>
    </Card>
  );
};

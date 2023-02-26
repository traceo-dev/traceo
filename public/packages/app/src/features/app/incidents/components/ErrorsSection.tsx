import dateUtils from "../../../../core/utils/date";
import { StoreState } from "@store/types";
import { Card, Table, TableColumn } from "@traceo/ui";
import { useSelector } from "react-redux";

export const ErrorsSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <Card title="Errors" className="h-auto">
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

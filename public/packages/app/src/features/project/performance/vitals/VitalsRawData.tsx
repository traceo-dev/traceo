import { VitalsEnum, Performance } from "@traceo/types";
import { Card, Table, TableColumn } from "@traceo/ui";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { mapHealthToIcon } from "./types";

interface Props {
  performances: Performance[];
  isLoading: boolean;
}
export const VitalsRawData = ({ performances, isLoading }: Props) => {
  const { name } = useParams();
  return (
    <Card title="Raw data">
      <Table
        collection={performances}
        loading={isLoading}
        pageSize={15}
        showPagination
        striped
        rowSize="md"
      >
        <TableColumn name="health">
          {({ item }) => item.health && mapHealthToIcon[item.health]}
        </TableColumn>
        <TableColumn name="time">
          {({ item }) => dayjs.unix(item.timestamp).format("HH:mm:ss DD-MM-YYYY")}
        </TableColumn>
        <TableColumn name="value" value="value" />
        {name !== VitalsEnum.CLS && <TableColumn name="unit" value="unit" />}
        <TableColumn name="event" value="event" />
        <TableColumn name="browser">
          {({ item }) => {
            if (!item["browser_name"]) {
              return "-";
            }

            return (
              <span>
                {item["browser_name"]} ({item["browser_version"]})
              </span>
            );
          }}
        </TableColumn>
        <TableColumn name="platform" value="platform_type" />
        <TableColumn name="view" value="view" />
      </Table>
    </Card>
  );
};
